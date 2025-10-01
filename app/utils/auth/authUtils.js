
let isRefreshing = false;
let refreshTimeout = null;
let refreshPromise = null;
const API_URL = "http://localhost:3333";
const MAX_REFRESH_ATTEMPTS = 3;


export async function checkAuthToken( request, csrfToken )
{
    const cookies = request.headers.get( "cookie" ) || "";
    const accessToken = getCookieValue( cookies, "accessToken" );
    const refreshToken = getCookieValue( cookies, "refreshToken" );

    // console.log( "📌 Extracted Tokens:", { accessToken, refreshToken } );

    try {
        const response = await fetch( `${API_URL}/api/auth/token`, {
            method: "GET",
            signal: request.signal,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken ? `Bearer ${accessToken}` : undefined,
                "x-refresh-token": refreshToken,
            },
        } );
        const data = await response.json();
        console.log( "📌 CheckAuth Token Response:", data);
        if ( !response.ok ) {
            // Attempt a single silent refresh if access token expired or unauthorized
            const errorType = data?.error?.type || data?.type || data?.code;
            if ( response.status === 401 && (errorType === 'TOKEN_EXPIRED' || errorType === 'UNAUTHORIZED') ) {
                const refreshResult = await refreshAccessToken( cookies, csrfToken );
                if ( refreshResult && refreshResult.user && !refreshResult.refreshExpired ) {
                    // Retry token check once after successful refresh
                    const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, refreshResult?.setCookieRaw);
                    const retry = await fetch( `${API_URL}/api/auth/token`, {
                        method: "GET",
                        signal: request.signal,
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            // Supply updated cookies explicitly for server-to-server fetch
                            cookie: mergedCookieHeader || cookies,
                        },
                    } );
                    const retryData = await retry.json();
                    if ( retry.ok && retryData?.user?.exp ) {
                        const refreshFollowUp = await scheduleTokenRefresh( retryData.user.exp, retryData.refreshExpire, mergedCookieHeader || cookies, csrfToken );
                        return {
                            user: refreshFollowUp?.user || retryData.user,
                            refreshExpire: refreshFollowUp?.refreshExpire || retryData.refreshExpire,
                            headers: refreshFollowUp?.headers || {},
                            checkHeaders: retry.headers || {},
                        };
                    }
                }
            }
            console.warn( "❌ No valid token. Logging out user." );
            return { user: null, refreshExpired: true };
        }
        const getHeaders = response?.headers;
        // console.log( "📌 Checkauth Token Data:", data );

        if ( !data?.user?.exp ) {
            console.warn( "⚠️ Missing expiration info. Logging out..." );
            return { user: null, refreshExpired: true };
        }

        // Schedule the next refresh and get the refreshed headers
        const refreshResult = await scheduleTokenRefresh( data.user.exp, data.refreshExpire, cookies, csrfToken );
        // console.log( "📌 Refresh Result:checkauthtoken", refreshResult );

        return {
            user: refreshResult?.user || data.user,
            refreshExpire: refreshResult?.refreshExpire || data.refreshExpire,
            headers: refreshResult?.headers || {},
            checkHeaders: getHeaders || {},
        };
        // return {
        //     user: data.user,
        //     refreshExpire: data.refreshExpire,
        //     headers: refreshResult?.headers || {},
        //     checkHeaders: getHeaders || {},
        // };


    } catch ( error ) {
        console.error( "🚨 Backend unreachable:", error.message );
        return { user: null, error: "An unexpected error occurred. Please try again later." };
    }
}






async function scheduleTokenRefresh( tokenExp, refreshExp, cookies, csrfToken )
{
    const tokenDuration = getTokenDuration( tokenExp );
    const refreshTokenDuration = refreshExp ? getTokenDuration( refreshExp ) : -1;

    // console.log("📌 Token Durations:", { tokenDuration, refreshTokenDuration });

    if ( refreshTokenDuration <= 0 ) {
        console.warn( "❌ Refresh token expired. User must log in again." );
        return;
    }

    if ( refreshTimeout ) {
        clearTimeout( refreshTimeout );
        refreshTimeout = null;
    }

    const refreshThreshold = 5000; // 10 seconds
    // console.log("📌 Token Duration vs Refresh Threshold:", tokenDuration, refreshThreshold);

    if ( tokenDuration > refreshThreshold ) {
        // console.log("✅ Access token is still valid. No refresh needed yet.");
        refreshTimeout = setTimeout( async () =>
        {
            const refreshResult = await handleTokenRefresh( cookies, csrfToken );
            // console.log("📌 Refresh Result:scheduleTokenRefresh1", refreshResult);
        }, tokenDuration - refreshThreshold );
    } else {
        // console.log("⚠️ Access token is about to expire. Refreshing now...");
        const refreshResult = await handleTokenRefresh( cookies, csrfToken ); // Trigger immediate refresh
        // console.log("📌 Refresh Result:scheduleTokenRefresh", refreshResult);
        return refreshResult; // Return headers from handleTokenRefresh
    }
}

async function handleTokenRefresh( cookies, csrfToken )
{
    if ( refreshPromise ) return refreshPromise;
    refreshPromise = refreshAccessToken( cookies, csrfToken )
        .catch( error =>
        {
            console.error( "🚨 Refresh failed:", error );
            return { user: null, refreshExpired: true };
        } )
        .finally( () =>
        {
            refreshPromise = null;
        } );

    //  console.log("📌 Refresh Promise Result:paco", refreshPromise);

    return refreshPromise;
}


export function getTokenDuration( exp )
{
    if ( !exp ) return -1;

    // Parse the expiration time as a Date object
    const expirationTime = new Date( exp ).getTime();
    if ( isNaN( expirationTime ) ) {
        console.error( "🚨 Invalid expiration format received:", exp );
        return -1;
    }

    // Calculate the duration in milliseconds
    const duration = expirationTime - Date.now();
    // console.log("📌 Token Expiration:", exp, "Expiration Time:", expirationTime, "Duration:", duration);
    return duration > 0 ? duration : -1; // Ensure only positive values are returned
}


export async function refreshAccessToken( cookies, csrfToken, attempt = 1 )
{
    if ( isRefreshing ) {
        console.warn( "⏳ Token refresh in progress. Awaiting existing request..." );
        return refreshPromise;
    }

    if ( attempt > MAX_REFRESH_ATTEMPTS ) {
        console.error( "🚨 Max refresh attempts reached. Logging out user." );
        return { user: null, refreshExpired: true };
    }

    isRefreshing = true;
    // console.log("🔄 Attempting token refresh (Attempt", attempt, ")...");

    try {
        const refreshFromCookie = getCookieValue(cookies || '', 'refreshToken');
        const response = await fetch( `${API_URL}/api/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": csrfToken,
                cookie: cookies,
            },
            body: JSON.stringify({ refreshToken: refreshFromCookie || undefined }),
        } );


        const getHeaders = response.headers;
        const refreshedData = await response.json();
        if ( !response.ok ) {
            console.warn( "❌ Refresh token expired. User must log in again.", refreshedData );
            return { user: null, refreshExpired: true, message: refreshedData.message };
        }

        console.log( "📌 Refreshed Token Data:", refreshedData );

        // Ensure refreshExpire is updated
        const refreshExpire = refreshedData.refreshExpire || null;
        if ( !refreshExpire ) {
            console.warn( "⚠️ Missing refresh expiration info. Logging out..." );
            return { user: null, refreshExpired: true };
        }
        const setCookieHeader = getHeaders.get( "set-cookie" ) || getHeaders.get("Set-Cookie");
        if ( !setCookieHeader ) {
            console.warn( "⚠️ No Set-Cookie header found in the response." );
            return { user: null, refreshExpired: true };
        }
        // console.log("📌 refreed data user exp:", refreshedData.user.exp,refreshExpire);

        // Schedule the next refresh
        const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, setCookieHeader);
        scheduleTokenRefresh( refreshedData.user.exp, refreshExpire, mergedCookieHeader );

        return {
            user: refreshedData.user,
            refreshExpire: refreshExpire,
            headers: getHeaders,
            setCookieRaw: setCookieHeader,
        };
    } catch ( error ) {
        console.error( "🚨 Error refreshing token. Retrying...", error );
        return refreshAccessToken( cookies, attempt + 1 );
    } finally {
        isRefreshing = false;
    }
}

const getCookieValue = ( cookieString, key ) =>
{
    return cookieString
        .split( "; " )
        .find( row => row.startsWith( `${key}=` ) )
        ?.split( "=" )[1] || "";
};

// Merge incoming Set-Cookie header(s) into an existing Cookie header string
function mergeCookiesWithSetCookie(existingCookieHeader = '', setCookieRaw) {
    try {
        if (!setCookieRaw) return existingCookieHeader;
        const existingMap = new Map(
            existingCookieHeader
                .split(/;\s*/)
                .filter(Boolean)
                .map(pair => {
                    const [k, ...rest] = pair.split('=');
                    return [k, rest.join('=')];
                })
        );

        const setCookieArray = Array.isArray(setCookieRaw) ? setCookieRaw : [setCookieRaw];
        for (const sc of setCookieArray) {
            // Each Set-Cookie: name=value; Path=/; HttpOnly; ...
            const firstPart = sc.split(';')[0];
            const [name, ...rest] = firstPart.split('=');
            if (!name) continue;
            const value = rest.join('=');
            existingMap.set(name.trim(), value);
        }

        return Array.from(existingMap.entries())
            .map(([k, v]) => `${k}=${v}`)
            .join('; ');
    } catch {
        return existingCookieHeader;
    }
}
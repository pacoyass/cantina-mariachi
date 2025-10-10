

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
                 cookie: cookies,
                
            },
        } );
    
        const getHeaders = response.headers;
        const data = await response.json();
        console.log( "📌 Checkauth Token Data:",data.data);
    // console.log( "📌 CheckAuth Token Response:", response );
    if ( !response.ok ) {
        console.warn( "❌ No valid token. Logging out user.",data.error );
        return { user: null, refreshExpired: true };
    }
        if ( !data?.data?.user?.exp ) {
            console.warn( "⚠️ Missing expiration info. Logging out..." );
            return { user: null, refreshExpired: true };
        }
     
           // Schedule the next refresh and get the refreshed headers
       const refreshResult = await scheduleTokenRefresh( data.data.user.exp, data.data.refreshExpire, cookies, csrfToken );
        console.log( "📌 Refresh Result:checkauthtoken tacos pacos", refreshResult );
       const checkHeaders=refreshResult?.headers
       console.log( "📌 Refresh Result:getheaders tacos pacos",getHeaders );
     

        return {
            user: refreshResult?.user || data.data.user,
            refreshExpire: refreshResult?.refreshExpire || data.data.refreshExpire,
            headers: checkHeaders || getHeaders ,
            // checkHeaders:refreshResult?.headers || {},
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

// export async function checkAuthToken(request, csrfToken) {
//     const cookies = request.headers.get("cookie") || "";
//     const accessToken = getCookieValue(cookies, "accessToken");
//     const refreshToken = getCookieValue(cookies, "refreshToken");
  
//     try {
//       const response = await fetch(`${API_URL}/api/auth/token`, {
//         method: "GET",
//         signal: request.signal,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": accessToken ? `Bearer ${accessToken}` : undefined,
//           "x-refresh-token": refreshToken,
//         },
//       });
  
//       if (!response.ok) {
//         console.warn("❌ Token invalid or expired.");
//         return { user: null, refreshExpired: true };
//       }
  
//       const tokenHeaders = response.headers;
//       const data = await response.json();
//   console.log("✅from checkauthtoken....",data);
  
//       if (!data?.data?.user?.exp) {
//         console.warn("⚠️ Missing expiration info. Logging out...");
//         return { user: null, refreshExpired: true };
//       }
  
//       // Try scheduling a refresh (might trigger immediate refresh if expiring soon)
//       const refreshResult = await scheduleTokenRefresh(
//         data.data.user.exp,
//         data.data.refreshExpire,
//         cookies,
//         csrfToken
//       );
  
//       // ✅ Prefer headers from refresh result if refresh happened
//       const finalHeaders =
//         refreshResult?.headers instanceof Headers
//           ? refreshResult.headers
//           : tokenHeaders;
//   console.log("final headers...",finalHeaders);
  
//       return {
//         user: refreshResult?.user || data.data.user,
//         refreshExpire: refreshResult?.refreshExpire || data.data.refreshExpire,
//         headers: finalHeaders,
//       };
//     } catch (error) {
//       console.error("🚨 Backend unreachable:", error.message);
//       return { user: null, error: "An unexpected error occurred." };
//     }
//   }
  


  
async function scheduleTokenRefresh( tokenExp, refreshExp, cookies, csrfToken )
{
    const tokenDuration = getTokenDuration( tokenExp );
    const refreshTokenDuration = refreshExp ? getTokenDuration( refreshExp ) : -1;

     console.log("📌 Token Durations:", { tokenDuration, refreshTokenDuration,refreshExp,tokenExp });

    if ( refreshTokenDuration <= 0 ) {
        console.error("❌ Refresh token expired. User must log in again." );
        
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
            const refreshResult= await handleTokenRefresh( cookies, csrfToken );
             console.log("📌 Refresh Result:scheduleTokenRefresh1", refreshResult);
             return refreshResult
        }, tokenDuration - refreshThreshold );
    } else {
        console.log("⚠️ Access token is about to expire. Refreshing now...");
        const refreshResult = await handleTokenRefresh( cookies, csrfToken ); // Trigger immediate refresh
         console.log("📌 Refresh Result:scheduleTokenRefresh", refreshResult);
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
    // console.log("🔄 Attempting token refresh (Attempt", attempt, ")...",cookies);

    try {
        const response = await fetch( `${API_URL}/api/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "x-csrf-token": csrfToken,
                cookie: cookies
            },
        } );


        const getHeaders = response.headers;
        const refreshedData = await response.json();
        console.log("refreshesd data ",refreshedData);
        
        if ( !response.ok ) {
            console.warn( "❌ Refresh token expired. User must log in again.", refreshedData );
            return { user: null, refreshExpired: true, message: refreshedData.error.message };
        }

        console.log( "📌 Refreshed Token Data:", refreshedData );

        // Ensure refreshExpire is updated
        const refreshExpire = refreshedData.data.refreshExpire || null;
        if ( !refreshExpire ) {
            console.warn( "⚠️ Missing refresh expiration info. Logging out..." );
            return { user: null, refreshExpired: true };
        }
        const setCookieHeader = getHeaders.get( "Set-Cookie" );
        if ( !setCookieHeader ) {
            console.warn( "⚠️ No Set-Cookie header found in the response." );
            return { user: null, refreshExpired: true };
        }
        // console.log("📌 refreed data user exp:", refreshedData.user.exp,refreshExpire);
        console.log("🔄 Scheduling next refresh with new token data:", {
            userExp: refreshedData.data.user.exp,
            refreshExpire: refreshExpire
        });
        // Schedule the next refresh
        scheduleTokenRefresh( refreshedData.data.user.exp, refreshExpire, cookies,csrfToken );

        return {
            user: refreshedData.data.user,
            refreshExpire: refreshExpire,
            headers: getHeaders,
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
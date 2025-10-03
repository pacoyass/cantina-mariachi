// // src/auth/tokenManager.js
// // Enhanced token manager: per-user refresh state, dedup fetch, tolerant validation,
// // circuit breaker (less aggressive), merge Set-Cookie handling, scheduling.

// let refreshTimeout = null;
// const API_URL = "http://localhost:3333";
// const MAX_REFRESH_ATTEMPTS = 3;

// // Per-user maps
// const refreshStates = new Map();     // userKey -> { promise, timestamp, timeout }
// const pendingRequests = new Map();   // requestKey -> promise

// // Circuit breaker (relaxed thresholds)
// const circuitBreaker = {
//   failures: 0,
//   lastFailure: 0,
//   // Open if >5 failures in last 30s
//   isOpen() {
//     return this.failures > 5 && Date.now() - this.lastFailure < 30_000;
//   },
//   recordSuccess() {
//     this.failures = Math.max(0, this.failures - 1);
//   },
//   recordFailure() {
//     this.failures++;
//     this.lastFailure = Date.now();
//   },
//   reset() {
//     this.failures = 0;
//     this.lastFailure = 0;
//   }
// };

// // Public entry: checkAuthToken(request, csrfToken)
// export async function checkAuthToken(request, csrfToken) {
//   const cookies = request.headers.get("cookie") || "";
//   const accessToken = getCookieValue(cookies, "accessToken");
//   const refreshToken = getCookieValue(cookies, "refreshToken");
//   const userKey = accessToken ? hashString(accessToken) : "anonymous";

//   try {
//     if (circuitBreaker.isOpen()) {
//       console.warn("Circuit breaker open — refusing token checks");
//       return { user: null, error: "Service temporarily unavailable. Please try again later." };
//     }

//     const response = await deduplicatedFetch(
//       `token-check-${userKey}`,
//       async () => fetch(`${API_URL}/api/auth/token`, {
//         method: "GET",
//         signal: request.signal,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": accessToken ? `Bearer ${accessToken}` : undefined,
//           "x-refresh-token": refreshToken
//         }
//       })
//     );

//     // If fetch itself failed unexpectedly (should be handled by fetch)
//     if (!response) {
//       circuitBreaker.recordFailure();
//       return { user: null, error: "No response from auth server" };
//     }

//     const data = await safeJson(response);
//     console.log("📌 CheckAuth Token Response:", data);

//     // If unauthorized/expired, try refresh flow
//     if (!response.ok) {
//       const errorType = data?.error?.type || data?.type || data?.code;
//       if (response.status === 401 && (errorType === "TOKEN_EXPIRED" || errorType === "UNAUTHORIZED")) {
//         const refreshResult = await handleTokenRefresh(userKey, cookies, csrfToken);

//         if (refreshResult?.user && !refreshResult.refreshExpired) {
//           const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, refreshResult?.setCookieRaw);
//           const retry = await fetch(`${API_URL}/api/auth/token`, {
//             method: "GET",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//               cookie: mergedCookieHeader || cookies
//             }
//           });

//           const retryData = await safeJson(retry);
//           if (!validateTokenResponse(retryData)) {
//             circuitBreaker.recordFailure();
//             return { user: null, refreshExpired: true };
//           }

//           const userData = retryData?.data?.user || retryData?.user;
//           const refreshExpire = retryData?.data?.refreshExpire || retryData?.refreshExpire;

//           if (retry.ok && userData?.id) {
//             // Schedule next refresh, prefer user.exp if present
//             const followUp = await scheduleTokenRefresh(
//               userData.exp || refreshExpire,
//               refreshExpire,
//               mergedCookieHeader || cookies,
//               csrfToken,
//               userKey
//             );

//             circuitBreaker.recordSuccess();
//             return {
//               user: followUp?.user || userData,
//               refreshExpire: followUp?.refreshExpire || refreshExpire,
//               headers: followUp?.headers || {},
//               checkHeaders: retry.headers || {}
//             };
//           }
//         }
//       }
//       circuitBreaker.recordFailure();
//       return { user: null, refreshExpired: true };
//     }

//     // Successful response
//     if (!validateTokenResponse(data)) {
//       circuitBreaker.recordFailure();
//       return { user: null, refreshExpired: true };
//     }

//     const userData = data?.data?.user || data?.user;
//     const refreshExpire = data?.data?.refreshExpire || data?.refreshExpire;

//     if (!userData?.id) {
//       circuitBreaker.recordFailure();
//       return { user: null, refreshExpired: true };
//     }

//     // Schedule refresh (if possible) - prefer userData.exp then refreshExpire
//     const refreshResult = await scheduleTokenRefresh(
//       userData.exp || refreshExpire,
//       refreshExpire,
//       cookies,
//       csrfToken,
//       userKey
//     );

//     circuitBreaker.recordSuccess();
//     return {
//       user: refreshResult?.user || userData,
//       refreshExpire: refreshResult?.refreshExpire || refreshExpire,
//       headers: refreshResult?.headers || {},
//       checkHeaders: response.headers || {}
//     };

//   } catch (err) {
//     circuitBreaker.recordFailure();
//     if (err?.name === "AbortError") return { user: null, error: "Request was cancelled." };
//     console.error("checkAuthToken error:", err);
//     return { user: null, error: "An unexpected error occurred. Please try again later." };
//   }
// }

// /* ---------- scheduling & refresh (per-user) ---------- */
// async function scheduleTokenRefresh(tokenExp, refreshExp, cookies, csrfToken, userKey) {
//   const tokenDuration = getTokenDuration(tokenExp);
//   const refreshTokenDuration = refreshExp ? getTokenDuration(refreshExp) : -1;

//   if (refreshTokenDuration <= 0) {
//     // refresh token expired
//     cleanupUserState(userKey);
//     return;
//   }

//   // clear previous timeout for this user (if any)
//   const state = refreshStates.get(userKey) || {};
//   if (state.timeout) {
//     clearTimeout(state.timeout);
//     state.timeout = null;
//   }

//   const refreshThreshold = 5000; // milliseconds before expiry to refresh
//   const nextRun = tokenDuration > refreshThreshold
//   ? Date.now() + (tokenDuration - refreshThreshold)
//   : Date.now();

// console.log(
//   `⏰ Refresh scheduled for user [${userKey}] in ${Math.round(
//     (nextRun - Date.now()) / 1000
//   )}s at ${new Date(nextRun).toISOString()}`
// );

//   if (tokenDuration > refreshThreshold) {
//     const timeoutId = setTimeout(async () => {
//       try {
//         await handleTokenRefresh(userKey, cookies, csrfToken);
//       } catch (e) {
//         console.error("Scheduled refresh error:", e);
//         cleanupUserState(userKey);
//       }
//     }, Math.max(0, tokenDuration - refreshThreshold));

//     refreshStates.set(userKey, { ...state, timeout: timeoutId, timestamp: Date.now() });
//     return; // no immediate refresh needed
//   } else {
//     // token is about to expire or already expired — refresh now
//     return await handleTokenRefresh(userKey, cookies, csrfToken);
//   }
// }

// async function handleTokenRefresh(userKey, cookies, csrfToken) {
//   const existing = refreshStates.get(userKey);
//   // reuse in-flight refresh if recent
//   if (existing?.promise && Date.now() - existing.timestamp < 5000) {
//     return existing.promise;
//   }

//   const promise = refreshAccessToken(cookies, csrfToken)
//     .catch(err => {
//       console.error("handleTokenRefresh failed:", err);
//       cleanupUserState(userKey);
//       return { user: null, refreshExpired: true };
//     })
//     .finally(() => {
//       const st = refreshStates.get(userKey);
//       if (st) refreshStates.set(userKey, { ...st, timestamp: Date.now() });
//     });

//   refreshStates.set(userKey, { promise, timestamp: Date.now(), timeout: existing?.timeout });
//   return promise;
// }

// /* ---------- actual network refresh with retries ---------- */
// export async function refreshAccessToken(cookies, csrfToken, attempt = 1) {
//   if (attempt > MAX_REFRESH_ATTEMPTS) {
//     console.error("Max refresh attempts reached");
//     return { user: null, refreshExpired: true };
//   }

//   try {
//     if (attempt > 1) {
//       const backoff = Math.min(1000 * Math.pow(2, attempt - 2), 10000);
//       await new Promise(r => setTimeout(r, backoff));
//     }

//     const refreshFromCookie = getCookieValue(cookies || "", "refreshToken");
//     const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         "x-csrf-token": csrfToken,
//         cookie: cookies
//       },
//       body: JSON.stringify({ refreshToken: refreshFromCookie || undefined })
//     });

//     const headers = response.headers;
//     const refreshedData = await safeJson(response);
//     console.log("📌 Refresh API Response:", refreshedData);

//     if (!response.ok || !validateTokenResponse(refreshedData)) {
//       console.warn("Refresh failed or response invalid");
//       return { user: null, refreshExpired: true };
//     }

//     const userData = refreshedData?.data?.user || refreshedData?.user;
//     const refreshExpire = refreshedData?.data?.refreshExpire || refreshedData?.refreshExpire;
//     const accessToken = refreshedData?.data?.accessToken || refreshedData?.accessToken;

//     if (!userData?.id) {
//       console.warn("Refresh response missing user id");
//       return { user: null, refreshExpired: true };
//     }

//     const setCookieHeader = headers.get("set-cookie") || headers.get("Set-Cookie");
//     const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, setCookieHeader);

//     // schedule next refresh with new data
//     const userKey = `user-${userData.id}`;
//     scheduleTokenRefresh(userData.exp || refreshExpire, refreshExpire, mergedCookieHeader, csrfToken, userKey);

//     // important: reset circuit breaker on success
//     circuitBreaker.recordSuccess();

//     return {
//       user: userData,
//       refreshExpire,
//       headers,
//       setCookieRaw: setCookieHeader,
//       accessToken
//     };

//   } catch (err) {
//     console.error("refreshAccessToken error:", err);
//     return refreshAccessToken(cookies, csrfToken, attempt + 1);
//   }
// }

// /* ---------- helpers ---------- */
// function getCookieValue(cookieString, key) {
//   if (!cookieString) return "";
//   return cookieString.split("; ").find(row => row.startsWith(`${key}=`))?.split("=")[1] || "";
// }

// function mergeCookiesWithSetCookie(existingCookieHeader = "", setCookieRaw) {
//   try {
//     if (!setCookieRaw) return existingCookieHeader;
//     const existingMap = new Map(
//       existingCookieHeader.split(/;\s*/).filter(Boolean).map(pair => {
//         const [k, ...rest] = pair.split("=");
//         return [k, rest.join("=")];
//       })
//     );

//     const setCookieArray = Array.isArray(setCookieRaw) ? setCookieRaw : [setCookieRaw];
//     for (const sc of setCookieArray) {
//       const firstPart = sc.split(";")[0];
//       const [name, ...rest] = firstPart.split("=");
//       if (!name) continue;
//       const value = rest.join("=");
//       existingMap.set(name.trim(), value);
//     }

//     return Array.from(existingMap.entries()).map(([k, v]) => `${k}=${v}`).join("; ");
//   } catch (err) {
//     console.error("mergeCookiesWithSetCookie error:", err);
//     return existingCookieHeader;
//   }
// }

// function validateTokenResponse(data) {
//   if (!data) return false;
//   if (data.status === "error" || data.error) return false;
//   const user = data?.data?.user || data?.user;
//   return Boolean(user && user.id);
// }

// async function deduplicatedFetch(key, fetchFn) {
//   if (pendingRequests.has(key)) {
//     // return the existing promise (avoid duplicate network calls)
//     return pendingRequests.get(key);
//   }
//   const promise = fetchFn().finally(() => pendingRequests.delete(key));
//   pendingRequests.set(key, promise);
//   return promise;
// }
// export function getTokenDuration(exp) {
//     if (!exp) return -1;
//     const expirationTime = typeof exp === "string" ? new Date(exp).getTime() : exp * 1000;
//     if (isNaN(expirationTime)) return -1;
//     const duration = expirationTime - Date.now();
//     return duration > 0 ? duration : -1;
// }

// function hashString(str) {
//   if (!str) return "unknown";
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     const char = str.charCodeAt(i);
//     hash = ((hash << 5) - hash) + char;
//     hash = hash & hash;
//   }
//   return Math.abs(hash).toString(36);
// }

// function cleanupUserState(userKey) {
//   const state = refreshStates.get(userKey);
//   if (state?.timeout) clearTimeout(state.timeout);
//   refreshStates.delete(userKey);
// }

// export function cleanupAuth() {
//   if (refreshTimeout) {
//     clearTimeout(refreshTimeout);
//     refreshTimeout = null;
//   }
//   for (const [, state] of refreshStates.entries()) {
//     if (state?.timeout) clearTimeout(state.timeout);
//   }
//   refreshStates.clear();
//   pendingRequests.clear();
//   circuitBreaker.reset();
// }

// if (typeof window !== "undefined") {
//   window.addEventListener("beforeunload", cleanupAuth);
// }

// /* Utility: safely parse JSON (handles empty body / invalid JSON) */
// async function safeJson(response) {
//   try {
//     return await response.json();
//   } catch {
//     return null;
//   }
// }





// // // src/auth/tokenManager.js

// // let refreshTimeout = null;
// // const API_URL = "http://localhost:3333";
// // const MAX_REFRESH_ATTEMPTS = 3;

// // // Maps for per-user isolation
// // const refreshStates = new Map();
// // const pendingRequests = new Map();

// // // Circuit breaker
// // const circuitBreaker = {
// //     failures: 0,
// //     lastFailure: 0,
// //     isOpen() {
// //         return this.failures > 3 && Date.now() - this.lastFailure < 30000;
// //     },
// //     recordSuccess() {
// //         this.failures = 0;
// //     },
// //     recordFailure() {
// //         this.failures++;
// //         this.lastFailure = Date.now();
// //     }
// // };

// // export async function checkAuthToken(request, csrfToken) {
// //     const cookies = request.headers.get("cookie") || "";
// //     const accessToken = getCookieValue(cookies, "accessToken");
// //     const refreshToken = getCookieValue(cookies, "refreshToken");

// //     const userKey = accessToken ? hashString(accessToken) : "anonymous";

// //     try {
// //         if (circuitBreaker.isOpen()) {
// //             return { user: null, error: "Service temporarily unavailable. Please try again later." };
// //         }

// //         const response = await deduplicatedFetch(
// //             `token-check-${userKey}`,
// //             async () => await fetch(`${API_URL}/api/auth/token`, {
// //                 method: "GET",
// //                 signal: request.signal,
// //                 credentials: "include",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     "Authorization": accessToken ? `Bearer ${accessToken}` : undefined,
// //                     "x-refresh-token": refreshToken,
// //                 },
// //             })
// //         );

// //         const data = await response.json();
// //         console.log("📌 CheckAuth Token Response:", data);

// //         if (!response.ok) {
// //             const errorType = data?.error?.type || data?.type || data?.code;
// //             if (response.status === 401 && (errorType === "TOKEN_EXPIRED" || errorType === "UNAUTHORIZED")) {
// //                 const refreshResult = await handleTokenRefresh(userKey, cookies, csrfToken);

// //                 if (refreshResult?.user && !refreshResult.refreshExpired) {
// //                     const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, refreshResult?.setCookieRaw);
// //                     const retry = await fetch(`${API_URL}/api/auth/token`, {
// //                         method: "GET",
// //                         signal: request.signal,
// //                         credentials: "include",
// //                         headers: {
// //                             "Content-Type": "application/json",
// //                             cookie: mergedCookieHeader || cookies,
// //                         },
// //                     });

// //                     const retryData = await retry.json();

// //                     if (!validateTokenResponse(retryData)) {
// //                         return { user: null, refreshExpired: true };
// //                     }

// //                     let userData = retryData?.data?.user || retryData?.user;
// //                     let refreshExpire = retryData?.data?.refreshExpire || retryData?.refreshExpire;

// //                     if (retry.ok && userData?.id) {
// //                         const refreshFollowUp = await scheduleTokenRefresh(
// //                             userData.exp,
// //                             refreshExpire,
// //                             mergedCookieHeader || cookies,
// //                             csrfToken,
// //                             userKey
// //                         );

// //                         circuitBreaker.recordSuccess();
// //                         return {
// //                             user: refreshFollowUp?.user || userData,
// //                             refreshExpire: refreshFollowUp?.refreshExpire || refreshExpire,
// //                             headers: refreshFollowUp?.headers || {},
// //                             checkHeaders: retry.headers || {},
// //                         };
// //                     }
// //                 }
// //             }

// //             circuitBreaker.recordFailure();
// //             return { user: null, refreshExpired: true };
// //         }

// //         if (!validateTokenResponse(data)) {
// //             return { user: null, refreshExpired: true };
// //         }

// //         let userData = data?.data?.user || data?.user;
// //         let refreshExpire = data?.data?.refreshExpire || data?.refreshExpire;

// //         if (!userData?.id) {
// //             return { user: null, refreshExpired: true };
// //         }

// //         const refreshResult = await scheduleTokenRefresh(
// //             userData.exp,
// //             refreshExpire,
// //             cookies,
// //             csrfToken,
// //             userKey
// //         );

// //         circuitBreaker.recordSuccess();
// //         return {
// //             user: refreshResult?.user || userData,
// //             refreshExpire: refreshResult?.refreshExpire || refreshExpire,
// //             headers: refreshResult?.headers || {},
// //             checkHeaders: response.headers || {},
// //         };

// //     } catch (error) {
// //         circuitBreaker.recordFailure();
// //         if (error.name === "AbortError") {
// //             return { user: null, error: "Request was cancelled." };
// //         }
// //         return { user: null, error: "An unexpected error occurred. Please try again later." };
// //     }
// // }

// // async function scheduleTokenRefresh(tokenExp, refreshExp, cookies, csrfToken, userKey) {
// //     const tokenDuration = getTokenDuration(tokenExp);
// //     const refreshTokenDuration = refreshExp ? getTokenDuration(refreshExp) : -1;

// //     if (refreshTokenDuration <= 0) {
// //         cleanupUserState(userKey);
// //         return;
// //     }

// //     if (refreshTimeout) {
// //         clearTimeout(refreshTimeout);
// //         refreshTimeout = null;
// //     }

// //     const refreshThreshold = 5000;

// //     if (tokenDuration > refreshThreshold) {
// //         refreshTimeout = setTimeout(async () => {
// //             try {
// //                 await handleTokenRefresh(userKey, cookies, csrfToken);
// //             } catch {
// //                 cleanupUserState(userKey);
// //             }
// //         }, tokenDuration - refreshThreshold);

// //         refreshStates.set(userKey, { ...refreshStates.get(userKey), timeout: refreshTimeout });
// //     } else {
// //         return await handleTokenRefresh(userKey, cookies, csrfToken);
// //     }
// // }

// // async function handleTokenRefresh(userKey, cookies, csrfToken) {
// //     const existingState = refreshStates.get(userKey);

// //     if (existingState?.promise && Date.now() - existingState.timestamp < 5000) {
// //         return existingState.promise;
// //     }

// //     const refreshPromise = refreshAccessToken(cookies, csrfToken)
// //         .catch(() => {
// //             cleanupUserState(userKey);
// //             return { user: null, refreshExpired: true };
// //         })
// //         .finally(() => {
// //             const state = refreshStates.get(userKey);
// //             if (state) {
// //                 refreshStates.set(userKey, { ...state, timestamp: Date.now() });
// //             }
// //         });

// //     refreshStates.set(userKey, { promise: refreshPromise, timestamp: Date.now() });
// //     return refreshPromise;
// // }

// // export function getTokenDuration(exp) {
// //     if (!exp) return -1;
// //     const expirationTime = typeof exp === "string" ? new Date(exp).getTime() : exp * 1000;
// //     if (isNaN(expirationTime)) return -1;
// //     const duration = expirationTime - Date.now();
// //     return duration > 0 ? duration : -1;
// // }

// // export async function refreshAccessToken(cookies, csrfToken, attempt = 1) {
// //     if (attempt > MAX_REFRESH_ATTEMPTS) {
// //         return { user: null, refreshExpired: true };
// //     }

// //     try {
// //         if (attempt > 1) {
// //             const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 2), 10000);
// //             await new Promise(resolve => setTimeout(resolve, backoffDelay));
// //         }

// //         const refreshFromCookie = getCookieValue(cookies || "", "refreshToken");
// //         const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
// //             method: "POST",
// //             credentials: "include",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 "x-csrf-token": csrfToken,
// //                 cookie: cookies,
// //             },
// //             body: JSON.stringify({ refreshToken: refreshFromCookie || undefined }),
// //         });

// //         const getHeaders = response.headers;
// //         const refreshedData = await response.json();
// //         console.log("📌 Refresh API Response:", refreshedData);

// //         if (!response.ok || !validateTokenResponse(refreshedData)) {
// //             return { user: null, refreshExpired: true };
// //         }

// //         let userData = refreshedData?.data?.user || refreshedData?.user;
// //         let refreshExpire = refreshedData?.data?.refreshExpire || refreshedData?.refreshExpire;
// //         let accessToken = refreshedData?.data?.accessToken;

// //         if (!userData?.id) {
// //             return { user: null, refreshExpired: true };
// //         }

// //         const setCookieHeader = getHeaders.get("set-cookie") || getHeaders.get("Set-Cookie");
// //         const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, setCookieHeader);

// //         const userKey = userData?.id ? `user-${userData.id}` : hashString(userData.exp);

// //         scheduleTokenRefresh(userData.exp, refreshExpire, mergedCookieHeader, csrfToken, userKey);

// //         return {
// //             user: userData,
// //             refreshExpire,
// //             headers: getHeaders,
// //             setCookieRaw: setCookieHeader,
// //             accessToken,
// //         };
// //     } catch {
// //         return refreshAccessToken(cookies, csrfToken, attempt + 1);
// //     }
// // }

// // // Helpers
// // const getCookieValue = (cookieString, key) => {
// //     if (!cookieString) return "";
// //     return cookieString
// //         .split("; ")
// //         .find(row => row.startsWith(`${key}=`))
// //         ?.split("=")[1] || "";
// // };

// // function mergeCookiesWithSetCookie(existingCookieHeader = "", setCookieRaw) {
// //     try {
// //         if (!setCookieRaw) return existingCookieHeader;
// //         const existingMap = new Map(
// //             existingCookieHeader.split(/;\s*/).filter(Boolean).map(pair => {
// //                 const [k, ...rest] = pair.split("=");
// //                 return [k, rest.join("=")];
// //             })
// //         );
// //         const setCookieArray = Array.isArray(setCookieRaw) ? setCookieRaw : [setCookieRaw];
// //         for (const sc of setCookieArray) {
// //             const firstPart = sc.split(";")[0];
// //             const [name, ...rest] = firstPart.split("=");
// //             if (!name) continue;
// //             const value = rest.join("=");
// //             existingMap.set(name.trim(), value);
// //         }
// //         return Array.from(existingMap.entries()).map(([k, v]) => `${k}=${v}`).join("; ");
// //     } catch {
// //         return existingCookieHeader;
// //     }
// // }

// // function validateTokenResponse(data) {
// //     if (!data) return false;
// //     if (data.status === "error" || data.error) return false;
// //     const user = data?.data?.user || data?.user;
// //     return Boolean(user?.id);
// // }

// // async function deduplicatedFetch(key, fetchFn) {
// //     if (pendingRequests.has(key)) {
// //         return pendingRequests.get(key);
// //     }
// //     const promise = fetchFn().finally(() => pendingRequests.delete(key));
// //     pendingRequests.set(key, promise);
// //     return promise;
// // }

// // function hashString(str) {
// //     if (!str) return "unknown";
// //     let hash = 0;
// //     for (let i = 0; i < str.length; i++) {
// //         const char = str.charCodeAt(i);
// //         hash = ((hash << 5) - hash) + char;
// //         hash = hash & hash;
// //     }
// //     return Math.abs(hash).toString(36);
// // }

// // function cleanupUserState(userKey) {
// //     const state = refreshStates.get(userKey);
// //     if (state?.timeout) clearTimeout(state.timeout);
// //     refreshStates.delete(userKey);
// // }

// // export function cleanupAuth() {
// //     if (refreshTimeout) {
// //         clearTimeout(refreshTimeout);
// //         refreshTimeout = null;
// //     }
// //     for (const [userKey, state] of refreshStates.entries()) {
// //         if (state.timeout) clearTimeout(state.timeout);
// //     }
// //     refreshStates.clear();
// //     pendingRequests.clear();
// //     circuitBreaker.failures = 0;
// //     circuitBreaker.lastFailure = 0;
// // }

// // if (typeof window !== "undefined") {
// //     window.addEventListener("beforeunload", cleanupAuth);
// // }









// // let isRefreshing = false;
// // let refreshTimeout = null;
// // let refreshPromise = null;
// // const API_URL = "http://localhost:3333";
// // const MAX_REFRESH_ATTEMPTS = 3;


// // export async function checkAuthToken( request, csrfToken )
// // {
// //     const cookies = request.headers.get( "cookie" ) || "";
// //     const accessToken = getCookieValue( cookies, "accessToken" );
// //     const refreshToken = getCookieValue( cookies, "refreshToken" );

// //     // console.log( "📌 Extracted Tokens:", { accessToken, refreshToken } );

// //     try {
// //         const response = await fetch( `${API_URL}/api/auth/token`, {
// //             method: "GET",
// //             signal: request.signal,
// //             credentials: "include",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 "Authorization": accessToken ? `Bearer ${accessToken}` : undefined,
// //                 "x-refresh-token": refreshToken,
// //             },
// //         } );
// //         const data = await response.json();
// //         console.log( "📌 CheckAuth Token Response:", data);
// //         if ( !response.ok ) {
// //             // Attempt a single silent refresh if access token expired or unauthorized
// //             const errorType = data?.error?.type || data?.type || data?.code;
// //             if ( response.status === 401 && (errorType === 'TOKEN_EXPIRED' || errorType === 'UNAUTHORIZED') ) {
// //                 const refreshResult = await refreshAccessToken( cookies, csrfToken );
// //                 if ( refreshResult && refreshResult.user && !refreshResult.refreshExpired ) {
// //                     // Retry token check once after successful refresh
// //                     const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, refreshResult?.setCookieRaw);
// //                     const retry = await fetch( `${API_URL}/api/auth/token`, {
// //                         method: "GET",
// //                         signal: request.signal,
// //                         credentials: "include",
// //                         headers: {
// //                             "Content-Type": "application/json",
// //                             // Supply updated cookies explicitly for server-to-server fetch
// //                             cookie: mergedCookieHeader || cookies,
// //                         },
// //                     } );
// //                     const retryData = await retry.json();
// //                     if ( retry.ok && retryData?.user?.exp ) {
// //                         const refreshFollowUp = await scheduleTokenRefresh( retryData.user.exp, retryData.refreshExpire, mergedCookieHeader || cookies, csrfToken );
// //                         return {
// //                             user: refreshFollowUp?.user || retryData.user,
// //                             refreshExpire: refreshFollowUp?.refreshExpire || retryData.refreshExpire,
// //                             headers: refreshFollowUp?.headers || {},
// //                             checkHeaders: retry.headers || {},
// //                         };
// //                     }
// //                 }
// //             }
// //             console.warn( "❌ No valid token. Logging out user." );
// //             return { user: null, refreshExpired: true };
// //         }
// //         const getHeaders = response?.headers;
// //         // console.log( "📌 Checkauth Token Data:", data );

// //         if ( !data?.user?.exp ) {
// //             console.warn( "⚠️ Missing expiration info. Logging out..." );
// //             return { user: null, refreshExpired: true };
// //         }

// //         // Schedule the next refresh and get the refreshed headers
// //         const refreshResult = await scheduleTokenRefresh( data.user.exp, data.refreshExpire, cookies, csrfToken );
// //         // console.log( "📌 Refresh Result:checkauthtoken", refreshResult );

// //         return {
// //             user: refreshResult?.user || data.user,
// //             refreshExpire: refreshResult?.refreshExpire || data.refreshExpire,
// //             headers: refreshResult?.headers || {},
// //             checkHeaders: getHeaders || {},
// //         };
// //         // return {
// //         //     user: data.user,
// //         //     refreshExpire: data.refreshExpire,
// //         //     headers: refreshResult?.headers || {},
// //         //     checkHeaders: getHeaders || {},
// //         // };


// //     } catch ( error ) {
// //         console.error( "🚨 Backend unreachable:", error.message );
// //         return { user: null, error: "An unexpected error occurred. Please try again later." };
// //     }
// // }






// // async function scheduleTokenRefresh( tokenExp, refreshExp, cookies, csrfToken )
// // {
// //     const tokenDuration = getTokenDuration( tokenExp );
// //     const refreshTokenDuration = refreshExp ? getTokenDuration( refreshExp ) : -1;

// //     // console.log("📌 Token Durations:", { tokenDuration, refreshTokenDuration });

// //     if ( refreshTokenDuration <= 0 ) {
// //         console.warn( "❌ Refresh token expired. User must log in again." );
// //         return;
// //     }

// //     if ( refreshTimeout ) {
// //         clearTimeout( refreshTimeout );
// //         refreshTimeout = null;
// //     }

// //     const refreshThreshold = 5000; // 10 seconds
// //     // console.log("📌 Token Duration vs Refresh Threshold:", tokenDuration, refreshThreshold);

// //     if ( tokenDuration > refreshThreshold ) {
// //         // console.log("✅ Access token is still valid. No refresh needed yet.");
// //         refreshTimeout = setTimeout( async () =>
// //         {
// //             const refreshResult = await handleTokenRefresh( cookies, csrfToken );
// //             // console.log("📌 Refresh Result:scheduleTokenRefresh1", refreshResult);
// //         }, tokenDuration - refreshThreshold );
// //     } else {
// //         // console.log("⚠️ Access token is about to expire. Refreshing now...");
// //         const refreshResult = await handleTokenRefresh( cookies, csrfToken ); // Trigger immediate refresh
// //         // console.log("📌 Refresh Result:scheduleTokenRefresh", refreshResult);
// //         return refreshResult; // Return headers from handleTokenRefresh
// //     }
// // }

// // async function handleTokenRefresh( cookies, csrfToken )
// // {
// //     if ( refreshPromise ) return refreshPromise;
// //     refreshPromise = refreshAccessToken( cookies, csrfToken )
// //         .catch( error =>
// //         {
// //             console.error( "🚨 Refresh failed:", error );
// //             return { user: null, refreshExpired: true };
// //         } )
// //         .finally( () =>
// //         {
// //             refreshPromise = null;
// //         } );

// //     //  console.log("📌 Refresh Promise Result:paco", refreshPromise);

// //     return refreshPromise;
// // }


// // export function getTokenDuration( exp )
// // {
// //     if ( !exp ) return -1;

// //     // Parse the expiration time as a Date object
// //     const expirationTime = new Date( exp ).getTime();
// //     if ( isNaN( expirationTime ) ) {
// //         console.error( "🚨 Invalid expiration format received:", exp );
// //         return -1;
// //     }

// //     // Calculate the duration in milliseconds
// //     const duration = expirationTime - Date.now();
// //     // console.log("📌 Token Expiration:", exp, "Expiration Time:", expirationTime, "Duration:", duration);
// //     return duration > 0 ? duration : -1; // Ensure only positive values are returned
// // }


// // export async function refreshAccessToken( cookies, csrfToken, attempt = 1 )
// // {
// //     if ( isRefreshing ) {
// //         console.warn( "⏳ Token refresh in progress. Awaiting existing request..." );
// //         return refreshPromise;
// //     }

// //     if ( attempt > MAX_REFRESH_ATTEMPTS ) {
// //         console.error( "🚨 Max refresh attempts reached. Logging out user." );
// //         return { user: null, refreshExpired: true };
// //     }

// //     isRefreshing = true;
// //     // console.log("🔄 Attempting token refresh (Attempt", attempt, ")...");

// //     try {
// //         const refreshFromCookie = getCookieValue(cookies || '', 'refreshToken');
// //         const response = await fetch( `${API_URL}/api/auth/refresh-token`, {
// //             method: "POST",
// //             credentials: "include",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 "x-csrf-token": csrfToken,
// //                 cookie: cookies,
// //             },
// //             body: JSON.stringify({ refreshToken: refreshFromCookie || undefined }),
// //         } );


// //         const getHeaders = response.headers;
// //         const refreshedData = await response.json();
// //         if ( !response.ok ) {
// //             console.warn( "❌ Refresh token expired. User must log in again.", refreshedData );
// //             return { user: null, refreshExpired: true, message: refreshedData.message };
// //         }

// //         console.log( "📌 Refreshed Token Data:", refreshedData );

// //         // Ensure refreshExpire is updated
// //         const refreshExpire = refreshedData.refreshExpire || null;
// //         if ( !refreshExpire ) {
// //             console.warn( "⚠️ Missing refresh expiration info. Logging out..." );
// //             return { user: null, refreshExpired: true };
// //         }
// //         const setCookieHeader = getHeaders.get( "set-cookie" ) || getHeaders.get("Set-Cookie");
// //         if ( !setCookieHeader ) {
// //             console.warn( "⚠️ No Set-Cookie header found in the response." );
// //             return { user: null, refreshExpired: true };
// //         }
// //         // console.log("📌 refreed data user exp:", refreshedData.user.exp,refreshExpire);

// //         // Schedule the next refresh
// //         const mergedCookieHeader = mergeCookiesWithSetCookie(cookies, setCookieHeader);
// //         scheduleTokenRefresh( refreshedData.user.exp, refreshExpire, mergedCookieHeader );

// //         return {
// //             user: refreshedData.user,
// //             refreshExpire: refreshExpire,
// //             headers: getHeaders,
// //             setCookieRaw: setCookieHeader,
// //         };
// //     } catch ( error ) {
// //         console.error( "🚨 Error refreshing token. Retrying...", error );
// //         return refreshAccessToken( cookies, attempt + 1 );
// //     } finally {
// //         isRefreshing = false;
// //     }
// // }

// // const getCookieValue = ( cookieString, key ) =>
// // {
// //     return cookieString
// //         .split( "; " )
// //         .find( row => row.startsWith( `${key}=` ) )
// //         ?.split( "=" )[1] || "";
// // };

// // // Merge incoming Set-Cookie header(s) into an existing Cookie header string
// // function mergeCookiesWithSetCookie(existingCookieHeader = '', setCookieRaw) {
// //     try {
// //         if (!setCookieRaw) return existingCookieHeader;
// //         const existingMap = new Map(
// //             existingCookieHeader
// //                 .split(/;\s*/)
// //                 .filter(Boolean)
// //                 .map(pair => {
// //                     const [k, ...rest] = pair.split('=');
// //                     return [k, rest.join('=')];
// //                 })
// //         );

// //         const setCookieArray = Array.isArray(setCookieRaw) ? setCookieRaw : [setCookieRaw];
// //         for (const sc of setCookieArray) {
// //             // Each Set-Cookie: name=value; Path=/; HttpOnly; ...
// //             const firstPart = sc.split(';')[0];
// //             const [name, ...rest] = firstPart.split('=');
// //             if (!name) continue;
// //             const value = rest.join('=');
// //             existingMap.set(name.trim(), value);
// //         }

// //         return Array.from(existingMap.entries())
// //             .map(([k, v]) => `${k}=${v}`)
// //             .join('; ');
// //     } catch {
// //         return existingCookieHeader;
// //     }
// // }



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
        // console.log( "📌 CheckAuth Token Response:", response );
        if ( !response.ok ) {
            console.warn( "❌ No valid token. Logging out user." );
            return { user: null, refreshExpired: true };
        }
        const getHeaders = response?.headers;
        const data = await response.json();
        console.log( "📌 Checkauth Token Data:",data.data);

        if ( !data?.data?.user?.exp ) {
            console.warn( "⚠️ Missing expiration info. Logging out..." );
            return { user: null, refreshExpired: true };
        }
     
           // Schedule the next refresh and get the refreshed headers
       const refreshResult = await scheduleTokenRefresh( data.data.user.exp, data.data.refreshExpire, cookies, csrfToken );
        console.log( "📌 Refresh Result:checkauthtoken", refreshResult );
       
     

        return {
            user: refreshResult?.user || data.data.user,
            refreshExpire: refreshResult?.refreshExpire || data.data.refreshExpire,
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

     console.log("📌 Token Durations:", { tokenDuration, refreshTokenDuration,refreshExp,tokenExp });

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
            return { user: null, refreshExpired: true, message: refreshedData.message };
        }

        console.log( "📌 Refreshed Token Data:", refreshedData );

        // Ensure refreshExpire is updated
        const refreshExpire = refreshedData.refreshExpire || null;
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

        // Schedule the next refresh
        scheduleTokenRefresh( refreshedData.user.exp, refreshExpire, cookies );

        return {
            user: refreshedData.user,
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
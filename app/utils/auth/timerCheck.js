
import { useCallback, useEffect } from "react";
import { useRevalidator, useSubmit } from "react-router";
import { getTokenDuration } from "./authUtils";

export function useTokenTimer( refreshExpire, userExp )
{
    const submit = useSubmit();
    const { revalidate } = useRevalidator();

    // Memoize functions to avoid recreating them
    const handleRevalidate = useCallback( () => revalidate(), [revalidate] );
    const handleLogout = useCallback( () => submit( null, { action: "/logout", method: "post" } ), [submit] );


    console.log("📌 Refresh Expire From timer:", refreshExpire, userExp);

    useEffect( () =>
    {
        if ( !refreshExpire || !userExp ) {
            console.log("⚠️ Missing token expiration data:", { refreshExpire, userExp });
            return;
        }

        const refreshDuration = getTokenDuration( refreshExpire );
        const userDuration = getTokenDuration( userExp );

        console.log("📌 Token Durations:", { 
            refreshDuration: Math.round(refreshDuration / 1000) + 's', 
            userDuration: Math.round(userDuration / 1000) + 's',
            refreshExpire,
            userExp
        });

<<<<<<< HEAD
        // console.log("📌 Refresh Token Duration:", refreshDuration);

        const userTimer = setTimeout( handleRevalidate, userDuration -10000);
        const logoutTimer = setTimeout( handleLogout, refreshDuration );
=======
        const userTimer = setTimeout( () => {
            console.log("🔄 Access token about to expire, revalidating...");
            handleRevalidate();
        }, userDuration - 5000 );
        
        const logoutTimer = setTimeout( () => {
            console.log("🚪 Refresh token expired, logging out...");
            handleLogout();
        }, refreshDuration );
>>>>>>> 666cf69f3d4252708c7da235a5e3eae20d8f1fb4

        return () =>
        {
            clearTimeout( userTimer );
            clearTimeout( logoutTimer );
        };
    }, [refreshExpire, userExp, handleRevalidate, handleLogout] ); // ✅ Use memoized functions
}

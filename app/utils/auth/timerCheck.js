
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
        if ( !refreshExpire || !userExp ) return;

        const refreshDuration = getTokenDuration( refreshExpire );
        const userDuration = getTokenDuration( userExp );


        console.log("📌 Refresh Token Duration:", refreshDuration);

        const userTimer = setTimeout( handleRevalidate, userDuration - 5000 );
        const logoutTimer = setTimeout( handleLogout, refreshDuration - 5000);

        return () =>
        {
            clearTimeout( userTimer );
            clearTimeout( logoutTimer );
        };
    }, [refreshExpire, userExp, handleRevalidate, handleLogout] ); // ✅ Use memoized functions
}

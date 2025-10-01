import { useCallback, useEffect } from "react";
import { useRevalidator, useSubmit } from "react-router";
import { getTokenDuration } from "./authUtils";

export function useTokenTimer(refreshExpire, userExp) {
  const submit = useSubmit();
  const { revalidate } = useRevalidator();

  const handleRevalidate = useCallback(() => revalidate(), [revalidate]);
  const handleLogout = useCallback(() => submit(null, { action: "/logout", method: "post" }), [submit]);

  useEffect(() => {
    if (!refreshExpire || !userExp) return;

    const refreshDuration = getTokenDuration(refreshExpire);
    const userDuration = getTokenDuration(userExp);

    const revalAt = userDuration > 5000 ? userDuration - 5000 : 0;

    const userTimer = setTimeout(handleRevalidate, revalAt);
    const logoutTimer = setTimeout(handleLogout, refreshDuration);

    return () => {
      clearTimeout(userTimer);
      clearTimeout(logoutTimer);
    };
  }, [refreshExpire, userExp, handleRevalidate, handleLogout]);
}


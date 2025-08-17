import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useMemo } from "react";

export default function Offers({ offers, t }) {
  const primary = offers?.[0];
  const expiry = useMemo(() => (primary?.expiresAt ? new Date(primary.expiresAt).getTime() : Date.now() + 1000 * 60 * 60 * 24), [primary?.expiresAt]);
  if (!primary) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('offers.heading')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{t('offers.coming') || 'New offers are coming soon.'}</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('offers.heading')}</CardTitle>
          {primary.badge ? <Badge variant="secondary">{primary.badge}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-[320px_1fr] md:items-center">
          <div className="rounded-md overflow-hidden border bg-muted">
            <div className="w-full aspect-video bg-gradient-to-br from-muted to-muted-foreground/10" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{primary.bundleName || t('offers.bundle')}</div>
              <div className="text-xl font-semibold">{primary.title || t('offers.deal')}</div>
              <div className="text-xs text-muted-foreground">{t('offers.endsIn')} <span data-offer-id={primary.id}>{formatCountdown(expiry)}</span></div>
            </div>
            <div className="flex gap-2">
              <Button>{t('offers.orderBundle')}</Button>
              <Button variant="outline">{t('offers.viewDetails')}</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatCountdown(toMs) {
  const diff = Math.max(0, Math.floor((toMs - Date.now()) / 1000));
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = Math.floor(diff % 60);
  return `${d}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
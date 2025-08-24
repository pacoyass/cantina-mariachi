import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Star } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function Testimonials({ testimonials = [] }) {
  const { t } = useTranslation('home');
  if (!testimonials.length) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent>
              <div className="animate-pulse h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  const fallbacks = [t('testimonials.t1'), t('testimonials.t2'), t('testimonials.t3')];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {testimonials.map((tst, idx) => (
        <Card key={tst.id || idx} className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{tst.initials || (tst.name || '?').slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{tst.name || ''}</div>
                  <div className="text-xs text-muted-foreground">{t('testimonials.verified')}</div>
                  <div className="flex items-center gap-1 text-yellow-500" aria-label={`${tst.rating || 5} stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3 ${i < Number(tst.rating || 5) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  {tst.date && <div className="text-xs text-muted-foreground">{new Date(tst.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {tst.content || fallbacks[idx % fallbacks.length]} <button className="underline text-xs">{t('testimonials.readMore')}</button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
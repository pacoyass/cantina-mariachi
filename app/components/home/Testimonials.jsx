import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Star } from "lucide-react";

export default function Testimonials({ testimonials = [] }) {
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
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.id} className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{t.initials || (t.name || '?').slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="flex items-center gap-1 text-yellow-500" aria-label={`${t.rating} stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3 ${i < Number(t.rating || 0) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{t.content}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
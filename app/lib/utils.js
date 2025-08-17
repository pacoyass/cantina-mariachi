import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, locale = undefined, currency = 'USD') {
  try {
    return new Intl.NumberFormat(locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US'), { style: 'currency', currency }).format(Number(amount || 0));
  } catch {
    return `$${Number(amount || 0).toFixed(2)}`;
  }
}

export async function track(event, props = {}, variant) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, props, variant })
    });
  } catch {}
}

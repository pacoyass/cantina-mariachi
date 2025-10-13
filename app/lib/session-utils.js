// Session utility functions

export function parseUserAgent(ua) {
  if (!ua) return { device: "Unknown", browser: "Unknown" };

  const isWindows = ua.includes("Windows");
  const isMac = ua.includes("Macintosh");
  const isLinux = ua.includes("Linux");
  const isMobile = /iPhone|Android/i.test(ua);

  const device = isMobile
    ? "Mobile"
    : isWindows
    ? "Windows"
    : isMac
    ? "Mac"
    : isLinux
    ? "Linux"
    : "Unknown";

  const match = ua.match(/(Chrome|Firefox|Safari|Edge)\/([\d.]+)/);
  const browser = match ? `${match[1]} ${match[2].split(".")[0]}` : "Unknown";

  return { device, browser };
}

export function formatRelativeTime(date, future = false) {
  const d = new Date(date);
  const diff = (d - new Date()) / 1000;
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  const label = future ? "in" : "";
  if (days > 0) return `${label} ${days} day${days > 1 ? "s" : ""}`;
  if (hrs > 0) return `${label} ${hrs} hour${hrs > 1 ? "s" : ""}`;
  if (mins > 0) return `${label} ${mins} minute${mins > 1 ? "s" : ""}`;
  return "just now";
}

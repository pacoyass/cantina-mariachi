export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    // Enable middleware API
    v8_middleware: true,
    // Keep existing flags as-is
    v3_singleFetch: false,
    unstable_singleFetch: false,
    v3_fetcherPersist: false,
    v3_relativeSplatPath: false,
    v3_throwAbortReason: false,
  },
};

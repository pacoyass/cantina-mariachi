export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // Explicitly disable all future flags to prevent turbo-stream issues
  future: {
    v3_singleFetch: false,
    unstable_singleFetch: false,
    v3_fetcherPersist: false,
    v3_relativeSplatPath: false,
    v3_throwAbortReason: false,
  },
};

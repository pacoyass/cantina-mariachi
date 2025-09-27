export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // Disable Single Fetch to fix turbo-stream decoding errors
  future: {
    unstable_singleFetch: false,
  },
};

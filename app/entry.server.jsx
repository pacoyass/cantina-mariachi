
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider } from 'react-i18next';
import { createServerI18n, rtlLngs } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

export const streamTimeout = 5000;

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  routerContext,
  loadContext
) {
  // Get language from context (set by server middleware)
  const lng = loadContext?.lng || 'en';
  
  // Create server i18n instance with the detected language
  // For SSR, we'll use fallback resources to ensure proper rendering
  const i18n = createServerI18n({ lng, resources: uiResources[lng] || uiResources.en });
  
  // Set document attributes for SSR
  const dir = rtlLngs.includes(lng) ? 'rtl' : 'ltr';
  
  // Add language and direction to response headers for better SEO
  responseHeaders.set("Content-Language", lng);
  responseHeaders.set("X-Language", lng);
  responseHeaders.set("X-Direction", dir);

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18n}>
        <ServerRouter
          context={routerContext}
          url={request.url}
          nonce={loadContext.nonce}
        />
      </I18nextProvider>,

      {
        nonce: loadContext.nonce,
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          
          // Set proper content type and language headers
          responseHeaders.set("Content-Type", "text/html; charset=utf-8");
          
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}

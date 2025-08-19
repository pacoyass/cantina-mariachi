
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider } from 'react-i18next';
import { createServerI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

export const streamTimeout = 5000;

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  routerContext,
  loadContext
) {
  const i18n = createServerI18n({ lng: loadContext?.lng || 'en', resources: uiResources });

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    
    // Handle both Web API and Express.js request formats
    let userAgent;
    if (request.headers && typeof request.headers.get === 'function') {
      // Web API format (production)
      userAgent = request.headers.get("user-agent");
    } else if (request.headers) {
      // Express.js format (development)
      userAgent = request.headers["user-agent"];
    }
    
    let readyOption =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18n}>
        <ServerRouter
          context={routerContext}
          url={request.url || request.originalUrl || '/')
          nonce={loadContext.nonce}
        />
      </I18nextProvider>,

      {
        nonce: loadContext.nonce,
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          
          // Handle both Web API and Express.js response headers formats
          if (responseHeaders && typeof responseHeaders.set === 'function') {
            // Web API format (production)
            responseHeaders.set("Content-Type", "text/html");
          } else if (responseHeaders) {
            // Express.js format (development)
            responseHeaders["Content-Type"] = "text/html";
          }
          
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

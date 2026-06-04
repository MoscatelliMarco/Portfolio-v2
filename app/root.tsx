import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

const statusMessages: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Access denied",
  404: "Page not found",
  405: "Method not allowed",
  408: "Request timeout",
  500: "Internal server error",
  502: "Bad gateway",
  503: "Service unavailable",
  504: "Gateway timeout",
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let statusCode = 500;
  let message = statusMessages[statusCode];
  let details: string | undefined;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    message =
      statusMessages[statusCode] ||
      error.statusText ||
      "Unexpected route error";
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#0a0a0a] px-6 py-16 font-sans text-[#a1a1a1] sm:px-10 md:px-16 lg:px-20">
      <section className="flex w-full max-w-lg flex-col items-center text-center">
        <img
          src="/error.webp"
          alt=""
          className="mb-9 w-full max-w-xs object-contain"
          decoding="async"
        />
        <h1 className="text-5xl font-semibold text-[#fafafa] sm:text-6xl">
          {statusCode}
        </h1>
        <p className="mt-3 text-[0.95rem] leading-[1.75]">{message}</p>
        <a
          href="/"
          className="animated-underline-link mt-5 text-[0.82rem] font-medium text-[#fafafa]"
        >
          Home
        </a>
      </section>
      {(details || stack) && (
        <section className="sr-only" aria-label="Developer error details">
          {details && <p>{details}</p>}
          {stack && <pre>{stack}</pre>}
        </section>
      )}
    </main>
  );
}

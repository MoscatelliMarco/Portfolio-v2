import { PostHogProvider } from "@posthog/react";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import {
  analyticsEnabled,
  initializeAnalytics,
  posthog,
} from "~/lib/analytics";

initializeAnalytics();

startTransition(() => {
  const router = <HydratedRouter />;

  hydrateRoot(
    document,
    analyticsEnabled ? (
      <PostHogProvider client={posthog}>{router}</PostHogProvider>
    ) : (
      router
    )
  );
});

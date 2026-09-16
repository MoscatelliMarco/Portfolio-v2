import type { BeforeSendFn, CaptureResult, Properties } from "posthog-js";
import posthog from "posthog-js";

const siteHost = "www.marcomoscatelli.com";
const siteOrigin = `https://${siteHost}`;

export const analyticsEnabled =
  import.meta.env.VITE_POSTHOG_ENABLED === "true" &&
  Boolean(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN) &&
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN !== "phc_replace_me" &&
  typeof window !== "undefined" &&
  window.location.hostname === siteHost;

const knownPaths = new Set([
  "/",
  "/projects",
  "/publications",
  "/education&experience",
]);

let acquisitionSource = "unknown";

export function initializeAnalytics() {
  if (!analyticsEnabled || typeof window === "undefined") {
    return;
  }

  acquisitionSource = classifyAcquisitionSource(
    window.location.href,
    document.referrer
  );

  posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com",
    defaults: "2026-05-30",
    cookieless_mode: "always",
    person_profiles: "never",
    persistence: "memory",
    respect_dnt: false,
    capture_pageview: "history_change",
    capture_pageleave: true,
    capture_performance: {
      network_timing: false,
      web_vitals: true,
      web_vitals_allowed_metrics: ["LCP", "CLS", "FCP", "INP"],
    },
    autocapture: {
      dom_event_allowlist: ["click"],
      element_allowlist: ["a", "button"],
      capture_copied_text: false,
    },
    mask_all_text: true,
    disable_session_recording: true,
    enable_recording_console_log: false,
    enable_heatmaps: false,
    capture_dead_clicks: false,
    rageclick: false,
    capture_exceptions: false,
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    disable_product_tours: true,
    disable_web_experiments: true,
    disableDeviceModel: true,
    before_send: sanitizeEvent,
  });
}

export function captureScrollDepth(depth: number) {
  if (!analyticsEnabled || typeof window === "undefined") {
    return;
  }

  posthog.capture("portfolio_scroll_depth_reached", {
    scroll_depth_percent: depth,
  });
}

export function normalizePagePath(pathname: string) {
  const withoutTrailingSlash =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  return knownPaths.has(withoutTrailingSlash) ? withoutTrailingSlash : "/other";
}

export function classifyAcquisitionSource(currentUrl: string, referrer: string) {
  const current = safeUrl(currentUrl);
  const campaignSource = current?.searchParams.get("utm_source")?.toLowerCase();
  const campaignCategory = classifySourceLabel(campaignSource);

  if (campaignCategory) {
    return campaignCategory;
  }

  if (!referrer) {
    return "direct";
  }

  const referringUrl = safeUrl(referrer);

  if (!referringUrl) {
    return "unknown";
  }

  const referringDomain = referringUrl.hostname;

  if (referringDomain === siteHost) {
    return "direct";
  }

  if (isDomain(referringDomain, "chatgpt.com") || isDomain(referringDomain, "openai.com")) {
    return "openai";
  }

  if (isDomain(referringDomain, "claude.ai") || isDomain(referringDomain, "anthropic.com")) {
    return "anthropic";
  }

  if (isDomain(referringDomain, "gemini.google.com")) {
    return "google_ai";
  }

  if (/(^|\.)google\.[a-z.]+$/.test(referringDomain)) {
    return "google_search";
  }

  if (isDomain(referringDomain, "reddit.com")) {
    return "reddit";
  }

  if (isDomain(referringDomain, "perplexity.ai")) {
    return "perplexity";
  }

  if (
    isDomain(referringDomain, "copilot.microsoft.com") ||
    isDomain(referringDomain, "copilot.microsoft365.com")
  ) {
    return "microsoft_ai";
  }

  if (isDomain(referringDomain, "linkedin.com")) {
    return "linkedin";
  }

  if (isDomain(referringDomain, "github.com")) {
    return "github";
  }

  return "other_referral";
}

const sanitizeEvent: BeforeSendFn = (captureResult) => {
  if (!captureResult || typeof window === "undefined") {
    return captureResult;
  }

  const properties = sanitizeProperties(captureResult.properties);
  const pagePath = eventPagePath(captureResult);

  properties.page_path = pagePath;
  properties.acquisition_source = acquisitionSource;
  properties.$host = siteHost;
  properties.$pathname = pagePath;
  properties.$current_url = `${siteOrigin}${pagePath}`;
  properties.$geoip_disable = true;

  return {
    ...captureResult,
    properties,
    $set: undefined,
    $set_once: undefined,
    $unset: undefined,
  } satisfies CaptureResult;
};

function sanitizeProperties(properties: Properties): Properties {
  const sanitized: Properties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (isSensitiveProperty(key)) {
      continue;
    }

    sanitized[key] = sanitizeNestedValue(value);
  }

  return sanitized;
}

function eventPagePath(captureResult: CaptureResult) {
  const previousPath = captureResult.properties.$prev_pageview_pathname;

  if (captureResult.event === "$pageleave" && typeof previousPath === "string") {
    return normalizePagePath(previousPath);
  }

  return normalizePagePath(window.location.pathname);
}

function sanitizeNestedValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeNestedValue);
  }

  if (value && typeof value === "object") {
    const sanitized: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      if (!isSensitiveProperty(key)) {
        sanitized[key] = sanitizeNestedValue(nestedValue);
      }
    }

    return sanitized;
  }

  return value;
}

function isSensitiveProperty(key: string) {
  const normalized = key.toLowerCase();

  if (
    normalized === "page_path" ||
    normalized === "acquisition_source"
  ) {
    return false;
  }

  return (
    normalized.includes("elements") ||
    normalized.startsWith("$el_") ||
    normalized.includes("url") ||
    normalized.includes("href") ||
    normalized.includes("pathname") ||
    normalized.includes("referr") ||
    normalized === "$host" ||
    normalized === "$search_engine" ||
    normalized.includes("device_model") ||
    normalized.includes("browser_version") ||
    normalized.includes("os_version") ||
    normalized.includes("timezone") ||
    normalized === "$locale" ||
    normalized.includes("screen_height") ||
    normalized.includes("screen_width") ||
    normalized.includes("viewport_height") ||
    normalized.includes("viewport_width") ||
    normalized.includes("utm_") ||
    normalized.includes("gclid") ||
    normalized.includes("fbclid") ||
    normalized.includes("msclkid") ||
    normalized === "href" ||
    normalized === "url" ||
    normalized === "email"
  );
}

function classifySourceLabel(source?: string | null) {
  if (!source) {
    return undefined;
  }

  const normalized = source.replace(/[\s-]+/g, "_");
  const categories: Record<string, string> = {
    openai: "openai",
    chatgpt: "openai",
    anthropic: "anthropic",
    claude: "anthropic",
    google: "google_search",
    google_search: "google_search",
    google_ai: "google_ai",
    gemini: "google_ai",
    reddit: "reddit",
    perplexity: "perplexity",
    microsoft_ai: "microsoft_ai",
    copilot: "microsoft_ai",
    linkedin: "linkedin",
    github: "github",
  };

  return categories[normalized];
}

function safeUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

function isDomain(actual: string, expected: string) {
  return actual === expected || actual.endsWith(`.${expected}`);
}

export { posthog };

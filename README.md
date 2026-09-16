A personal portfolio website built with React Router, React, TypeScript, Vite, and Tailwind CSS.

## Edit information

- [`app/content/home.md`](app/content/home.md) — Homepage content. Its formatting rules are documented in [`app/content/README.md`](app/content/README.md).
- [`app/content/content.json`](app/content/content.json) — Projects, publications, experience, education, extracurricular activities, and certifications.
- [`cv/cv.tex`](cv/cv.tex) — LaTeX source for the CV.

## Analytics

This portfolio uses PostHog Cloud in cookieless mode for anonymous, aggregate web and product analytics. Session replay is intentionally disabled.

### Setup

In PostHog, enable **cookieless tracking**, enable **Discard client IP data**, set event retention to **12 months**, and authorize only `www.marcomoscatelli.com` for this project. The client tracker initializes only on that hostname, so localhost, previews, aliases, and other deployments do not send events.

### What is tracked

- `$pageview` and `$pageleave`, including PostHog's page-view duration; `$pathname` and `$current_url` are reduced to the four known routes or `/other`, with query strings and fragments removed.
- `$web_vitals`: LCP, CLS, FCP, and INP.
- `portfolio_scroll_depth_reached` at 25%, 50%, 75%, and 100%.
- `$autocapture` only for clicks on links and buttons. Text, destinations, DOM trees, query strings, fragments, raw referrers, raw campaign values, email addresses, screen dimensions, and device models are removed before sending.
- `acquisition_source`, classified locally as `direct`, `openai`, `anthropic`, `google_search`, `google_ai`, `reddit`, `perplexity`, `microsoft_ai`, `linkedin`, `github`, `other_referral`, or `unknown`. Raw referrer and UTM values are not sent. A Google AI Overview without a Gemini referrer or explicit AI campaign is classified as `google_search`.
- The browser user agent required for PostHog's cookieless identifier, plus broad browser, OS, and device type metadata supplied by PostHog. No `identify`, aliases, person profiles, forms, exceptions, console logs, heatmaps, surveys, product tours, or session recordings are collected.

Every event includes `page_path` and `acquisition_source`. Named clicks also include `click-name`, `surface`, and `link-kind`. Current click names are:

- Home: `home_bocconi`, `home_projects`, `home_publications`, `home_education_experience`, `home_linkedin`, `home_github`, `home_email`, `home_cv`.
- Navigation: `projects_home`, `publications_home`, `education_experience_home`, `error_home`.
- Projects: `project_<project_slug>_open` and `project_<project_slug>_source`.
- Publications: `publication_<publication_slug>_open`.
- Experience: `experience_ma_research`.

In PostHog, create one Action per click name by filtering `$autocapture` where `click-name` equals the listed value.

### Privacy and legal position

The configuration writes no cookies, local storage, or session storage, and therefore avoids the storage/access trigger that commonly requires an EU/UK cookie banner. It also minimizes data and uses no person profiles. `respect_dnt` is deliberately `false`; browser Do Not Track does not stop collection.

This does **not** guarantee worldwide compliance or make the data legally anonymous. IP addresses reach PostHog before server-side discarding, and PostHog creates a short-lived privacy-preserving identifier, so GDPR/UK GDPR and similar laws can still treat the processing as personal data. Maintain a PostHog DPA, EU data residency, a documented legitimate-interest assessment, the 12-month limit, security controls, and a public privacy notice with applicable access/objection rights. Do not use the data for advertising, sale, sharing, sensitive inference, or identification. Under US state laws, the setup is not intended as a sale/share, but notices and consumer rights still apply when statutory thresholds are met. Brazil, Canada, and other countries have separate transparency, lawful-basis, and consent rules.

Reassess the banner decision before enabling replay, cookies/storage, fingerprinting, advertising, raw URLs/referrers, or person profiles. This internal document is not legal advice and does not replace a public privacy notice.

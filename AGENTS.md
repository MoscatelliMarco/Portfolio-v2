# Repository scope

This repository contains Marco Moscatelli's personal portfolio website and LaTeX CV.

## Profile and content updates

When asked to update Marco's profile or portfolio content, modify only:

- `app/content/home.md` — homepage copy; follow the syntax documented in `app/content/README.md`.
- `app/content/content.json` — structured website content.
- `cv/cv.tex` — LaTeX CV source.

Treat `app/content/README.md` as read-only documentation unless the user explicitly asks to change it.

Keep facts shared by the website and CV consistent. Before finishing, compare names, roles, organizations, dates, education, projects, and descriptions across the relevant files and resolve contradictions.

Never modify, regenerate, replace, or copy over `public/cv.pdf`. The user exports `cv/cv.tex` and updates the public PDF manually.

## Contact details

- LinkedIn: <https://www.linkedin.com/in/moscatellimarco/>
- GitHub: <https://github.com/MoscatelliMarco>
- Work email: `me@marcomoscatelli.com`

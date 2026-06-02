# Home Content Markdown

`home.md` is rendered by the homepage with a small custom parser. Each block of text separated by a blank line becomes one animated paragraph.

## Paragraphs

Separate paragraphs with one blank line:

```md
First paragraph with some text.

Second paragraph with some text.
```

## Accent Text

Use `<accent>...</accent>` to render inline white emphasis:

```md
This text is gray, but <accent>this part is white</accent>.
```

## Handwritten Text

Use `<handwritten>...</handwritten>` for the handwritten Caveat-style treatment:

```md
I care about the <handwritten>little details</handwritten> in the work.
```

## Shimmering Text

Use `<shimmering>...</shimmering>` for animated shimmering text:

```md
I work on <shimmering>AI and data science</shimmering>.
```

## Age

Use `<age />` to calculate age from the `BIRTHDATE` environment variable. In browser-exposed Vite environments, use `VITE_BIRTHDATE`.

```md
I am <age /> years old.
```

Expected date format:

```env
BIRTHDATE=2006-01-01
VITE_BIRTHDATE=2006-01-01
```

## Links

Use `<link href="...">...</link>` for links:

```md
You can find me on <link href="https://www.linkedin.com/in/moscatellimarco/">LinkedIn</link>.
```

External links open in a new tab. Links are not underlined by default.

## Underline

Use `<underline>...</underline>` for the animated underline:

```md
You can find me on <link href="https://www.linkedin.com/in/moscatellimarco/"><underline>LinkedIn</underline></link>.
```

The underline has a fixed gray base line and a white left-to-right hover animation.

## Icons

Use `<icon name="linkedin" />`, `<icon name="github" />`, or `<icon name="mail" />` for inline icons.

```md
You can find me on <link href="https://www.linkedin.com/in/moscatellimarco/"><icon name="linkedin" /><underline>LinkedIn</underline></link>.
See my code on <link href="https://github.com/MoscatelliMarco"><icon name="github" /><underline>GitHub</underline></link>.
Email me at <link href="mailto:info@example.com"><icon name="mail" /><underline>info@example.com</underline></link>.
```

## Notes

Supported tags can be nested:

```md
This is <accent>white</accent>, this is <handwritten>Caveat</handwritten>, and this is <shimmering>shimmering</shimmering>.

This is a <link href="https://example.com"><accent><underline>white underlined link</underline></accent></link>.
```

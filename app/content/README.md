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

## Links

Use `<link href="...">...</link>` for links:

```md
You can find me on <link href="https://www.linkedin.com/in/moscatellimarco/">LinkedIn</link>.
```

External links open in a new tab. Links have a fixed gray underline and a white left-to-right hover animation.

## Images

Use `<image src="..."></image>` for inline images. Put image files under `public/images`, then reference them from `/images/...`:

```md
Reach me on <image src="/images/linkedin.png"></image> <link href="https://www.linkedin.com/in/moscatellimarco/">LinkedIn</link>.
```

Images render inline at text height.

## Notes

Supported tags can be nested:

```md
This is <accent>white</accent>, this is <handwritten>Caveat</handwritten>, and this is <shimmering>shimmering</shimmering>.

This is a <link href="https://example.com"><accent>white link</accent></link>.
```

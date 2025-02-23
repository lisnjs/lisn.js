<div align="center">
  <a href="https://lisnjs.github.io/"><img src="https://raw.githubusercontent.com/lisnjs/lisn.js/master/website/LISN%20logo.png" width="160" height="160" alt="LISN.js"></a>
</div>

<h2 align="center">
 <a href="https://lisnjs.github.io/">Official site</a>&nbsp;|&nbsp;<a href="https://lisnjs.github.io/demos/">Demos</a>&nbsp;|&nbsp;<a href="https://lisnjs.github.io/docs/">Docs</a>
</h2>

# Intro

LISN.js is a flexible, full-featured and simple to use library for handling user
gestures and interactions (like scrolling) as well as observing elements for
changes in viewport position, size and so on.

LISN handles all complexities (and browser quirks) so you can simply handle user
gestures, interactions and layout events. It makes it super simple and easy to
implement any kind of scroll, view, size, layout or user gesture triggered
actions or animations with minimal boilerplate, and even if you wish, with zero
JavaScript, using the HTML-only mode. It also comes with many customizable
widgets.

There are React wrappers available as a separate package. It works in
server-side rendering environments like Next.js.

LISN also comes with many awesome widgets, like collapsible, floating popup, modal,
offcanvas menu, pager (carousel/slider/tabs), flex same-height, scrollbars
(native scrolling), sortable, scroll-to-top button and page loader.

# Installing

```bash
npm install lisn.js
# OR
yarn add lisn.js
```

# Loading it

```javascript
// Import whatever components from "lisn.js"
import { GestureWatcher, Pager } from "lisn.js";
```

Or use the pre-built browser bundles:

```html
<script
  src="https://cdn.jsdelivr.net/npm/@lisn.js/bundles@1.0.0/lisn.min.js"
  charset="utf-8"
></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@lisn.js/bundles@1.0.0/styles/lisn.css"
  type="text/css"
  media="screen"
  title="no title"
  charset="utf-8"
/>
```

There are slim and essential bundles that include less features, so you can load
whichever one you need. See [Choose your bundle](https://lisnjs.github.io/#bundles)

## React wrappers

Install the `@lisn.js/react` package and import the components you need:

```bash
npm install @lisn.js/react
# OR
yarn add @lisn.js/react
```

```javascript
// Import whatever components from "lisn.js"
import { useScrollbar, PagerComponent } from "@lisn.js/react";
```

<h2 align="center">
 <a href="https://github.com/lisnjs/lisn.js/blob/main/CONTRIBUTING.md">Contributing</a>
</h2>

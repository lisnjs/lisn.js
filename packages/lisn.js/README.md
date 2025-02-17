## Contents

* [Intro](#intro)
* [Basic concepts](#basic-concepts)
  * [Watchers](#watchers)
  * [Triggers](#triggers)
  * [Actions](#actions)
  * [Widgets](#widgets)
* [Loading LISN](#loading-lisn)
  * [Importing it](#importing-it)
  * [Embedding the bundle](#embedding-the-bundle)
* [HTML-only mode (aka auto-widgets)](#html-only-mode-aka-auto-widgets)
  * [In browser bundles](#in-browser-bundles)
  * [In modules](#in-modules)
* [Customizing](#customizing)
  * [Settings](#settings)
  * [CSS](#css)
    * [Light/dark theme](#lightdark-theme)
* [Examples/demos](#examplesdemos)

# Intro

LISN.js is a flexible, full-featured and simple to use library for handling user
gestures and interactions (like scrolling) as well as observing elements for
changes in viewport position, size and so on.

LISN handles all complexities (and browser quirks) so you can simply handle user
gestures, actions and layout events.

There are React wrappers available as a separate package. It works in
server-side rendering environments like Next.js.

LISN also comes with many awesome widgets, like collapsible, floating popup, modal,
offcanvas menu, pager (carousel/slider/tabs), flex same-height, scrollbars
(native scrolling), sortable, scroll-to-top button and page loader.

**This documentation is for the vanilla JavaScript package. React documentation coming soon!**

# Basic concepts

LISN's basic blocks include watchers, triggers, actions and widgets.

## Watchers

These are the base classes that allow you to lisn for various events or user
gestures and run callbacks. They are highly configurable and most flexible. Many
of them are build around `MutationObserver`, `IntersectionObserver` and
`ResizeObserver`, though some listen for primitive events directly.

## Triggers

They are simple wrappers around (some of) the watchers that allow you to use the
watchers in the HTML-only mode, or as a simpler/quicker alternative for some
actions. You always use Triggers together with Actions.

Each trigger is tied to an element and a set of actions. It can be run (forward),
reversed or toggled (which does, undoes or toggles each action).

When you create a trigger you specify a set of conditions that run it, and
implicitly any opposite condition will reverse it. LISN is smart about what's
opposite: for example if you use the scroll trigger and specify the direction as
"up" then only scroll "down" will reverse it. But if you specify the direction
as "up,down", then "left" or "right" scroll will reverse it.

## Actions

Actions are simple classes that do or undo one thing. They're really useful when
used with triggers since they have a `do`, `undo` and `toggle` methods.

## Widgets

Widgets are... well widgets. Like a pager, a custom scrollbar, a scroll-to-top
button and so on. They configure a specific element in a certain way. They may
wrap or move the element. Each widget has a set of basic actions like `enable`,
`disable` and `destroy` (which reverts it back to the original state). Widgets
also include some basic CSS which you should load by either importing it
directly or loading LISN's CSS files from the CDN.

Triggers are actually a special kind of a widget.

# Loading LISN

## Importing it

Everything is available for importing from the main entry point `"lisn.js"`, but
there are also sub-exports available, that correspond to the respective group:

* `"lisn.js/watchers"`
* `"lisn.js/triggers"`
* `"lisn.js/actions"`
* `"lisn.js/widgets"`
* `"lisn.js/globals"`
* `"lisn.js/modules"`
* `"lisn.js/utils"`
* `"lisn.js/debug"`

## Embedding the bundle

Download the bundle of your choice (see
[Choose your bundle](https://lisnjs.github.io/#bundles) or use jsdelivr,
and embed it, as well as the CSS file, in on your page:

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

**NOTE:** If using the page loader, you want to place the script in the `<head>`
rather than in the footer, so that it can initialize the page loader as soon as
possible:

```html
<!-- LISN should be loaded beforehand -->
<script>
  LISN.widgets.PageLoader.enableMain();
</script>
```

# HTML-only mode (aka auto-widgets)

LISN supports the so called HTML-only mode or alternatively "auto-widgets" which
listens for changes to the DOM and picks up any elements that match a specific
widget selector. For example `[data-lisn-pager]` or `.lisn-pager` selectors
match the Pager widget. As soon as such an element is inserted into the DOM,
LISN will instantiate it as a widget. Each widget supports a human-readable
string configuration that you can set in its data attribute (not supported if
using class names). See the [documentation](https://lisnjs.github.io/docs) on
Widgets for more info.

**NOTE:** The data attribute or class name must be set on the element before
inserting it into the DOM. For performance reasons LISN does not watch for
attribute mutations, but only child list changes.

## In browser bundles

Pre-built bundles support auto-widgets by default, you do not need to do
anything.

## In modules

Normally when building a JavaScript app, you would import the widgets, triggers
and actions and instante them. If, however, you want to use auto-widgets, then
you need to do 2 things:

1. Register the widget/trigger/action by calling its `register` method:

```javascript
import { Pager } from "lisn.js";

Pager.register();
```

2. Enable "auto-widgets" (which is only enabled by default in browser bundles):

```javascript
import { settings as lisnSettings } from "lisn.js";

lisnSettings.autoWidgets = true;
```

***

Then you can use auto-widgets for example like so:

```javascript
const pager = document.createElement("div");
pager.dataLisnPager = "horizontal=true | use-gestures=touch,wheel";

// create some elements to act as pages, at least 2 required, and append them
// ...

// then finally
document.body.append(pager);
```

# Customizing

## Settings

LISN comes with a variety of settings which you can customize before
instantiating any components.

In your module:

```javascript
import { settings as lisnSettings } from "lisn.js";

// Update, for example:
lisnSettings.deviceBreakpoints.desktop = 1024;
```

Or if using the bundle:

```html
<!-- LISN should be loaded beforehand -->
<script>
  LISN.settings.deviceBreakpoints.desktop = 1024;
</scrip>
```

## CSS

LISN's supports many variables that allow you to override the default styles for
widgets as well as the colors. A complete list of the variables is coming soon.

You can either set those variables as custom properties on the root element (or
any relevant element), or if you use SCSS in your project and want to rebuild
LISN's CSS, you can modify its SCSS variables before importing it.

For example:

```html
<style type="text/css" media="screen">
  :root {
    --lisn-color-dark: rgba(43, 46, 51, 1);
    --lisn-color-dark-t: rgba(43, 46, 51, 0.9);
    --lisn-color-light: rgba(239, 240, 243, 1);
    --lisn-color-light-t: rgba(239, 240, 243, 0.9);
  }
</style>
```

Or SCSS:

```scss
dark-color: rgba(43, 46, 51, 1);
dark-color-t: rgba(43, 46, 51, 0.9);
light-color: rgba(239, 240, 243, 1);
light-color-t: rgba(239, 240, 243, 0.9);

@use "lisn.js/src/styles/common";
```

Of course, you will sometimes need to override some style. LISN's CSS selectors
try to be as least specific as possible (while avoiding `:where` in order to
ensure maximum browser compatibility).

It's best if you load LISN's CSS early on so that your own selectors of equal
specificity can override it.

### Light/dark theme

By default LISN assumes a light theme, but is aware of common theme classes and
will switch the light and dark colors when a parent element has the `dark-theme`
or `light-theme`. If you use SCSS, you can change the name of the classes used
by setting the `$light-theme-cls` and `$dark-theme-cls` variables.

# Examples/demos

Throughout the [Demos](https://lisnjs.github.io/docs) there are some basic
examples, mostly to do with using widgets/triggers/actions in HTML only mode.

For complete and more advanced examples, see the
[Demos](https://lisnjs.github.io/demos). You may also find the
[tests](https://github.com/lisnjs/lisn.js/tree/main/packages/lisn.js/tests)
useful. Although rough, there's likely everything that you'll want to find in
there.

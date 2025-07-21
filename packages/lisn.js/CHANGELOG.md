# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.2] - 2025-07-21

- ADDED: CheckTrigger widget
- ADDED: ScrollToTop widget now supports a custom scrollable element
- ADDED: TrackSize widget accepts config now
- ADDED: Triggers clean up on being destroyed
- ADDED: Scrollbar respects an existing wrapper elements and uses those
- ADDED: ScrollTo action now accepts a duration option
- ADDED: New utility functions:
  - criticallyDamped
  - waitForAnimationFrame
  - onEveryAnimationFrame
  - newCriticallyDampedAnimationIterator
  - newAnimationFrameIterator
  - toggleClassesNow
  - toggleClasses
  - replaceClassNow
  - replaceClass

- FIXED: SctollTo action was not using the configured scrollable
- FIXED: isScrollable now handles overflowing elements that have overflow set to
  something other than scroll or auto (previously it was returning a false
  positive, true, when in fact it wasn't scrollable)
- FIXED: More reliable Scrollbar CSS
- FIXED: Scrollbar additional clean up on destroy
- FIXED: moveChildren\* utility functions were always using ignoreMove: true

- CHANGED: Improved scroll animation: Now based on a critically damped spring.
  It seamlessly resumes a previous scroll that was interrupted.
- CHANGED: Scrollbar now checks for sticky support and aborts if it needs sticky
  but browser does not support
- CHANGED: One-time triggers destroy themselves when done

---

## [1.1.2] - 2025-02-27

### Minor changes + updated README

- CHANGED: get/set/unset/delBoolData are now called get/set/unset/delBooleanData
  (old deprecated name maintained for backwards compatibility)

---

## [1.1.1] - 2025-02-26

### Minor CSS fix

- CHANGED: Setting max-width/height to 100% for carousel page container.

---

## [1.1.0] - 2025-02-26

### Added built-in pager styles

- ADDED: Basic CSS for slider (still the default), carousel and tabs.
- REMOVED: page box-shadow from pager CSS.
- FIXED: data-lisn-current-page-is-last was set incorrectly

---

## [1.0.4] - 2025-02-22

### Improved compatibility with Vite and Webpack

- CHANGED: Conditional import of socket.io-client now uses a method that doesn't
  result in even a warning with Webpack.

---

## [1.0.3] - 2025-02-22

### Improved compatibility with Vite

- CHANGED: Conditional import of socket.io-client now uses a dynamic import with
  non-literal string in order to work with Vite. The downside is that in Webpack
  there is a warning (but not a fatal error).

---

## [1.0.2] - 2025-02-17

### Improved compatibility with older environments

- REMOVED: use of named regex capture groups to support older browsers (though
  said browsers would still need polyfills for ResizeObserver)
- ADDED: a `/* webpackIgnore: true */` in front of dynamic import of socket.io
  to make it work with Webpack (and hence Next.js pre version 15). Prior to this
  version, Webpack would throw an error about module not found even though it's
  wrapped in a try/catch block.

---

## [1.0.1] - 2025-02-16

### Updated build to remove unnecessary transpiling

- CHANGED: Updated browserslist to specific target browsers.

---

## [1.0.0] - 2025-02-15

### Initial Release

- First stable release.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.2] - 2025-27-02

### Minor changes + updated README

- get/set/unset/delBoolData are now called get/set/unset/delBooleanData (old
  deprecated name maintained for backwards compatibility)

---

## [1.1.1] - 2025-26-02

### Minor CSS fix

- Setting max-width/height to 100% for carousel page container.

---

## [1.1.0] - 2025-26-02

### Added built-in pager styles

- Basic CSS for slider (still the default), carousel and tabs.
- Removed page box-shadow from pager CSS.
- Bug fix: data-lisn-current-page-is-last was set incorrectly

---

## [1.0.4] - 2025-22-02

### Improved compatibility with Vite and Webpack

- Conditional import of socket.io-client now uses a method that doesn't result
  in even a warning with Webpack.

---

## [1.0.3] - 2025-22-02

### Improved compatibility with Vite

- Conditional import of socket.io-client now uses a dynamic import with
  non-literal string in order to work with Vite. The downside is that in
  Webpack there is a warning (but not a fatal error).

---

## [1.0.2] - 2025-17-02

### Improved compatibility with older environments

- Removed use of named regex capture groups to support older browsers (though
  said browsers would still need polyfills for ResizeObserver)
- Added a `/* webpackIgnore: true */` in front of dynamic import of socket.io to
  make it work with Webpack (and hence Next.js pre version 15). Prior to this
  version, Webpack would throw an error about module not found even though it's
  wrapped in a try/catch block.

---

## [1.0.1] - 2025-16-02

### Updated build to remove unnecessary transpiling

- Updated browserslist to specific target browsers.

---

## [1.0.0] - 2025-15-02

### Initial Release

- First stable release.

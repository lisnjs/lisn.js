"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _logger = require("./logger.cjs");
var _console = require("./console.cjs");
var _remoteConsole = require("./remote-console.cjs");
/**
 * @module
 * @ignore
 * @internal
 */
// Used internally to allow importing it conditionally based on the bundle
// type. This module's export is replaced with a dummy null export in
// production bundles.
var _default = exports["default"] = {
  Logger: _logger.Logger,
  Console: _console.Console,
  RemoteConsole: _remoteConsole.RemoteConsole
};
//# sourceMappingURL=debug.cjs.map
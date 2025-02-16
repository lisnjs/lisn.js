"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _logger = require("./logger.cjs");
Object.keys(_logger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _logger[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _logger[key];
    }
  });
});
var _console = require("./console.cjs");
Object.keys(_console).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _console[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _console[key];
    }
  });
});
var _remoteConsole = require("./remote-console.cjs");
Object.keys(_remoteConsole).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _remoteConsole[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _remoteConsole[key];
    }
  });
});
//# sourceMappingURL=index.cjs.map
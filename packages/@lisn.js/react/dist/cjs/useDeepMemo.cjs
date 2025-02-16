"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDeepMemo = void 0;
var _react = require("react");
var _dequal = require("dequal");
var useDeepMemo = exports.useDeepMemo = function useDeepMemo(value) {
  var valueRef = (0, _react.useRef)(value);
  return (0, _react.useMemo)(function () {
    if (!(0, _dequal.dequal)(value, valueRef.current)) {
      valueRef.current = value;
    }
    return valueRef.current;
  }, [value]);
};
//# sourceMappingURL=useDeepMemo.cjs.map
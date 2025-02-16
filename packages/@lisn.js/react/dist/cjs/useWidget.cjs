"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWidget = void 0;
var _react = require("react");
var _useDeepMemo = require("./useDeepMemo");
var useWidget = exports.useWidget = function useWidget(newWidget, config, widgetRef) {
  var elementRef = (0, _react.useRef)(null);
  var widgetRefInternal = (0, _react.useRef)(null);
  var configMemo = (0, _useDeepMemo.useDeepMemo)(config);
  (0, _react.useEffect)(function () {
    if (elementRef.current instanceof Element) {
      widgetRefInternal.current = newWidget(elementRef.current, configMemo);
    }
    return function () {
      var _widgetRefInternal$cu;
      (_widgetRefInternal$cu = widgetRefInternal.current) === null || _widgetRefInternal$cu === void 0 || _widgetRefInternal$cu.destroy();
    };
  }, [configMemo, newWidget]);
  (0, _react.useImperativeHandle)(widgetRef, function () {
    return {
      getWidget: function getWidget() {
        return widgetRefInternal.current;
      }
    };
  });
  return elementRef;
};
//# sourceMappingURL=useWidget.cjs.map
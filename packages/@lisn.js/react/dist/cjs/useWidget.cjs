"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWidget = void 0;
var _react = require("react");
var _useDeepMemo = require("./useDeepMemo");
const useWidget = (newWidget, config, widgetRef) => {
  const elementRef = (0, _react.useRef)(null);
  const widgetRefInternal = (0, _react.useRef)(null);
  const configMemo = (0, _useDeepMemo.useDeepMemo)(config);
  (0, _react.useEffect)(() => {
    if (elementRef.current instanceof Element) {
      widgetRefInternal.current = newWidget(elementRef.current, configMemo);
    }
    return () => {
      var _widgetRefInternal$cu;
      (_widgetRefInternal$cu = widgetRefInternal.current) === null || _widgetRefInternal$cu === void 0 || _widgetRefInternal$cu.destroy();
    };
  }, [configMemo, newWidget]);
  (0, _react.useImperativeHandle)(widgetRef, () => {
    return {
      getWidget: () => widgetRefInternal.current
    };
  });
  return elementRef;
};
exports.useWidget = useWidget;
//# sourceMappingURL=useWidget.cjs.map
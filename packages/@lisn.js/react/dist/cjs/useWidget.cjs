"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWidget = void 0;
var _react = require("react");
var _useDeepMemo = require("./useDeepMemo");
const useWidget = (newWidget, config, widgetRef) => {
  const configs = config instanceof Array ? config : [config];
  const elementRef = (0, _react.useRef)(null);
  const widgetRefsInternal = (0, _react.useRef)([]);
  const configsMemo = (0, _useDeepMemo.useDeepMemo)(configs);
  (0, _react.useEffect)(() => {
    if (elementRef.current instanceof Element) {
      for (const thisConfig of configsMemo) {
        const widget = newWidget(elementRef.current, thisConfig);
        if (widget) {
          widgetRefsInternal.current.push(widget);
        }
      }
    }
    const widgets = widgetRefsInternal.current;
    return () => {
      for (const widget of widgets) {
        widget.destroy();
      }
      widgetRefsInternal.current = [];
    };
  }, [configsMemo, newWidget]);
  (0, _react.useImperativeHandle)(widgetRef, () => {
    return {
      getWidget: () => {
        var _widgetRefsInternal$c;
        return (_widgetRefsInternal$c = widgetRefsInternal.current[0]) !== null && _widgetRefsInternal$c !== void 0 ? _widgetRefsInternal$c : null;
      },
      getWidgets: () => widgetRefsInternal.current
    };
  });
  return elementRef;
};
exports.useWidget = useWidget;
//# sourceMappingURL=useWidget.cjs.map
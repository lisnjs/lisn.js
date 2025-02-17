"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementsFromRefs = void 0;
const getElementsFromRefs = refs => refs === null || refs === void 0 ? void 0 : refs.map(r => r.current).filter(e => e !== null);
exports.getElementsFromRefs = getElementsFromRefs;
//# sourceMappingURL=util.cjs.map
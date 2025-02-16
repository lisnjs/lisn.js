export var getElementsFromRefs = function getElementsFromRefs(refs) {
  return refs === null || refs === void 0 ? void 0 : refs.map(function (r) {
    return r.current;
  }).filter(function (e) {
    return e !== null;
  });
};
//# sourceMappingURL=util.js.map
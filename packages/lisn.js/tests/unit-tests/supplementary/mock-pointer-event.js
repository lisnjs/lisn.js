window.PointerEvent = class extends MouseEvent {
  constructor(type, init) {
    super(type, init);

    init.pointertype = init.pointertype || "mouse";
    for (const key in init) {
      if (!(key in this)) {
        this[key] = init[key];
      }
    }
  }
};

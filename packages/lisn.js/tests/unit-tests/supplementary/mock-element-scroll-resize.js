window.SCROLL_WIDTH = 2000;
window.SCROLL_HEIGHT = 1000;
window.CLIENT_WIDTH = 200;
window.CLIENT_HEIGHT = 100;

document.scrollingElement = document.documentElement;

Element.prototype.getBoundingClientRect = function () {
  const targetWidth = this.clientWidth || window.CLIENT_WIDTH;
  const targetHeight = this.clientHeightidth || window.CLIENT_HEIGHT;

  const boundingClientRect = {};
  boundingClientRect.x = boundingClientRect.left =
    -document.documentElement.scrollLeft;
  boundingClientRect.y = boundingClientRect.top =
    -document.documentElement.scrollTop;
  boundingClientRect.right = boundingClientRect.width = targetWidth;
  boundingClientRect.bottom = boundingClientRect.height = targetHeight;

  return boundingClientRect;
};

const elementAppend = Element.prototype.append;
Element.prototype.append = function (...args) {
  elementAppend.apply(this, args);

  if (!this._isScrollable) {
    this.resize(
      [this.offsetWidth, this.offsetHeight + 10],
      [this.clientWidth, this.offsetHeight + 10],
    );
  }
};

// Prevent modifying scrollTop/Left unless element's been marked as scrollable
// (by calling scrollTo)
const scrollTop = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "scrollTop",
);
Object.defineProperty(Element.prototype, "scrollTop", {
  get: scrollTop.get,
  set: function (v) {
    if (this._isScrollable) {
      scrollTop.set.call(this, v);
    }
  },
});

const scrollLeft = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "scrollLeft",
);
Object.defineProperty(Element.prototype, "scrollLeft", {
  get: scrollLeft.get,
  set: function (v) {
    if (this._isScrollable) {
      scrollLeft.set.call(this, v);
    }
  },
});

// Make size props writable
for (const ctx of ["scroll", "offset", "client"]) {
  const targetProto = Object.hasOwn(HTMLElement.prototype, `${ctx}Width`)
    ? HTMLElement.prototype
    : Element.prototype;

  for (const dim of ["Width", "Height"]) {
    const originalGetter = Object.getOwnPropertyDescriptor(
      targetProto,
      `${ctx}${dim}`,
    ).get;
    Object.defineProperty(targetProto, `${ctx}${dim}`, {
      get: originalGetter,
      set: function (v) {
        Object.defineProperty(this, `${ctx}${dim}`, {
          value: v,
          writable: true,
        });
      },
    });
  }
}

Element.prototype.resetScroll = function () {
  delete this._isScrollable;

  this.scrollWidth = this.clientWidth;
  this.scrollHeight = this.clientHeight;

  this.scrollTop = this.scrollLeft = 0;
};

Element.prototype.enableScroll = function () {
  if (this === document.body) {
    return;
  }

  this._isScrollable = true;

  this.style.overflow = "auto";
  this.scrollHeight = window.SCROLL_HEIGHT;
  this.scrollWidth = window.SCROLL_WIDTH;
  this.clientHeight = window.CLIENT_HEIGHT;
  this.clientWidth = window.CLIENT_WIDTH;

  this.scrollTo(0, 0);
};

Element.prototype.scrollTo = function (...args) {
  if (!this._isScrollable) {
    return;
  }

  let x, y;
  if (args.length === 1 && args[0] instanceof Object) {
    x = args[0].left;
    y = args[0].top;
  } else {
    x = args[0];
    y = args[1];
  }

  if (x !== undefined) {
    this.scrollLeft = Math.min(x, this.scrollWidth);
  }

  if (y !== undefined) {
    this.scrollTop = Math.min(y, this.scrollHeight);
  }

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let eventTarget = this;
  if (this === document.documentElement) {
    eventTarget = document;
  }
  eventTarget.dispatchEvent(new Event("scroll"));
};

Element.prototype.resize = function (
  offset = [Math.random() * 1000, Math.random() * 1000],
  client = null,
) {
  // For the purposes of mocking ResizeObserver, use offsetWidth/Height as
  // border box size and use clientWidth/Height as content box size...
  client = client ?? offset;

  [this._prevOffsetWidth, this._prevOffsetHeight] = [
    this.offsetWidth,
    this.offsetHeight,
  ];
  [this._prevClientWidth, this._prevClientHeight] = [
    this.clientWidth,
    this.clientHeight,
  ];
  [this.offsetWidth, this.offsetHeight] = offset;
  [this.clientWidth, this.clientHeight] = client;

  if (this.scrollWidth === 0 && this.scrollHeight === 0) {
    [this.scrollWidth, this.scrollHeight] = client;
  }

  this.dispatchEvent(new Event("resize"));
};

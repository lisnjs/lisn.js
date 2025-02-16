// The mock IntersectionObserver is very finicky and I'm not 100% sure it's
// behaving as a real one.
// TODO maybe switch to https://jestjs.io/docs/puppeteer

const blankRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

window.IntersectionObserverEntry = class {
  boundingClientRect;
  rootBounds;
  intersectionRect;
  intersectionRatio;
  isIntersecting;
  target;
  time;

  constructor(target, views = null) {
    this.target = target;
    this.time = Date.now();

    this.rootBounds = {
      ...blankRect,
      right: window.SCROLL_WIDTH,
      width: window.SCROLL_WIDTH,
      bottom: window.SCROLL_HEIGHT,
      height: window.SCROLL_HEIGHT,
    };

    this.boundingClientRect = { ...blankRect }; // initial

    // in case target doesn't have a size set, use default
    const targetWidth = target.clientWidth || window.CLIENT_WIDTH;
    const targetHeight = target.clientHeightidth || window.CLIENT_HEIGHT;

    let offsetLeft = 0,
      offsetTop = 0;

    if (views !== null) {
      // Force a specific view
      for (const view of views) {
        if (view === "at") {
          offsetLeft = offsetTop = 0;
          break;
        } else if (view === "left") {
          offsetLeft = this.rootBounds.right + 100;
        } else if (view === "right") {
          offsetLeft = -targetWidth - 100;
        } else if (view === "above") {
          offsetTop = this.rootBounds.bottom + 100;
        } else if (view === "below") {
          offsetTop = -targetHeight - 100;
        }
      }
    } else {
      // views not given, assume element is at top left of document and use
      // scroll position
      offsetLeft = -document.documentElement.scrollLeft;
      offsetTop = -document.documentElement.scrollTop;
    }

    this.boundingClientRect.x = this.boundingClientRect.left = offsetLeft;
    this.boundingClientRect.y = this.boundingClientRect.top = offsetTop;
    this.boundingClientRect.right = this.boundingClientRect.width =
      offsetLeft + targetWidth;
    this.boundingClientRect.bottom = this.boundingClientRect.height =
      offsetTop + targetHeight;

    const intersectLeft = Math.max(
      this.rootBounds.left,
      this.boundingClientRect.left,
    );

    const intersectTop = Math.max(
      this.rootBounds.top,
      this.boundingClientRect.top,
    );

    const intersectRight = Math.min(
      this.rootBounds.right,
      this.boundingClientRect.right,
    );

    const intersectBottom = Math.min(
      this.rootBounds.bottom,
      this.boundingClientRect.bottom,
    );

    const intersectWidth = intersectRight - intersectLeft;
    const intersectHeight = intersectBottom - intersectTop;

    this.isIntersecting = intersectWidth > 0 && intersectHeight > 0;
    this.isIntersectingRatio =
      ((intersectWidth / targetWidth) * intersectHeight) / targetHeight;

    if (this.isIntersecting) {
      this.intersectionRect = {
        x: intersectLeft,
        left: intersectLeft,
        y: intersectTop,
        top: intersectTop,
        right: intersectRight,
        bottom: intersectBottom,
        width: intersectWidth,
        height: intersectHeight,
      };
    } else {
      this.intersectionRect = { ...blankRect };
    }
  }
};

window.IntersectionObserver = class {
  static instances = new Map();
  static instancesList = [];
  static onNextInstance = [];

  targets = new Set();

  constructor(callback, options) {
    let queue = [];
    let timer = 0;

    const schedule = (entry) => {
      queue.push(entry);
      if (timer === 0) {
        timer = window.setTimeout(() => {
          const oldQueue = queue;
          timer = 0;
          queue = [];
          if (oldQueue.length > 0) {
            callback(oldQueue, this);
          }
        }, 0);
      }
    };

    this.root = options?.root || null;
    this.rootMargin = options?.rootMargin || "0px 0px 0px 0px";
    this.thresholds = options?.threshold || 0;

    this.trigger = (target, views = null) => {
      if (this.targets.has(target)) {
        const entry = new IntersectionObserverEntry(target, views);
        schedule(entry);
      }
    };

    this.observe = (t) => {
      if (this.targets.has(t)) {
        return;
      }

      this.targets.add(t);

      let targetInstances = IntersectionObserver.instances.get(t);
      if (targetInstances === undefined) {
        targetInstances = new Set();
        IntersectionObserver.instances.set(t, targetInstances);
      }
      targetInstances.add(this);

      // trigger on first observe
      schedule(new IntersectionObserverEntry(t));
    };

    this.unobserve = (t) => {
      if (!this.targets.has(t)) {
        return;
      }

      this.targets.delete(t);

      const targetInstances = IntersectionObserver.instances.get(t);
      if (targetInstances !== undefined) {
        targetInstances.delete(this);
      }

      for (let i = 0; i < queue.length; i++) {
        if (queue[i].target === t) {
          queue.splice(i, 1);
          i--;
        }
      }
    };

    this.disconnect = () => {
      for (const t of this.targets) {
        this.unobserve(t);
      }
    };

    this.takeRecords = () => {
      const oldQueue = queue;
      queue = [];
      return oldQueue;
    };

    IntersectionObserver.instancesList.push(this);
    const callbacks = IntersectionObserver.onNextInstance;
    IntersectionObserver.onNextInstance = [];
    for (const cbk of callbacks) {
      cbk(this);
    }
  }
};

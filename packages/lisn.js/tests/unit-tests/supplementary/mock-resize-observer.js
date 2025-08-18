/* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "__ignored" }] */

class ResizeObserverEntry {
  borderBoxSize = [{ blockSize: 0, inlineSize: 0 }];
  contentBoxSize = [{ blockSize: 0, inlineSize: 0 }];
  contentRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  constructor(target, border = [0, 0], content = [0, 0]) {
    this.target = target;
    this.borderBoxSize[0].inlineSize = border[0];
    this.borderBoxSize[0].blockSize = border[1];
    this.contentBoxSize[0].inlineSize = content[0];
    this.contentBoxSize[0].blockSize = content[1];
    this.contentRect.width = content[0];
    this.contentRect.height = content[1];
  }
}

class ResizeObserver {
  static instances = new Map();
  static instancesList = [];
  static onNextInstance = [];

  targets = new Map();

  constructor(callback) {
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

    const onResize = (event) => {
      const target = event.target;
      const border = [target.offsetWidth, target.offsetHeight];
      const content = [target.clientWidth, target.clientHeight];
      const changedBorderW = border[0] !== target._prevOffsetWidth;
      const changedBorderH = border[1] !== target._prevOffsetHeight;
      const changedContentW = content[0] !== target._prevClientWidth;
      const changedContentH = content[1] !== target._prevClientHeight;
      const observeType = this.targets.get(target);

      if (
        (observeType === "content-box" && changedContentH) ||
        changedContentW ||
        (observeType === "border-box" && changedBorderH) ||
        changedBorderW
      ) {
        schedule(new ResizeObserverEntry(target, border, content));
      }
    };

    this.observe = (t, options = { box: "content-box" }) => {
      if (this.targets.has(t)) {
        return;
      }

      this.targets.set(t, options.box);

      let targetInstances = ResizeObserver.instances.get(t);
      if (targetInstances === undefined) {
        targetInstances = new Set();
        ResizeObserver.instances.set(t, targetInstances);
      }
      targetInstances.add(this);

      // trigger on first observe
      const border = [t.offsetWidth, t.offsetHeight];
      const content = [t.clientWidth, t.clientHeight];
      schedule(new ResizeObserverEntry(t, border, content));
      t.addEventListener("resize", onResize);
    };

    this.unobserve = (t) => {
      if (!this.targets.has(t)) {
        return;
      }

      this.targets.delete(t);

      const targetInstances = ResizeObserver.instances.get(t);
      if (targetInstances !== undefined) {
        targetInstances.delete(this);
      }

      t.removeEventListener("resize", onResize);
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].target === t) {
          queue.splice(i, 1);
          i--;
        }
      }
    };

    this.disconnect = () => {
      for (const [t, b__ignored] of this.targets) {
        this.unobserve(t);
      }
    };

    IntersectionObserver.instancesList.push(this);
    const callbacks = ResizeObserver.onNextInstance;
    ResizeObserver.onNextInstance = [];
    for (const cbk of callbacks) {
      cbk(this);
    }
  }
}

window.ResizeObserverEntry = ResizeObserverEntry;
window.ResizeObserver = ResizeObserver;

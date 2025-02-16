const MutationObserver = window.MutationObserver;
window.MutationObserver = class {
  static instances = new Map();

  targets = new Set();

  constructor(...args) {
    const instance = new MutationObserver(...args);

    this.observe = (t, options) => {
      this.targets.add(t);

      let targetInstances = window.MutationObserver.instances.get(t);
      if (targetInstances === undefined) {
        targetInstances = new Set();
        window.MutationObserver.instances.set(t, targetInstances);
      }
      targetInstances.add(this);

      instance.observe(t, options);
    };

    this.disconnect = () => {
      for (const t of this.targets) {
        this.targets.delete(t);

        const targetInstances = window.MutationObserver.instances.get(t);
        if (targetInstances !== undefined) {
          targetInstances.delete(this);
        }
      }

      instance.disconnect();
    };

    this.takeRecords = () => instance.takeRecords();
  }
};

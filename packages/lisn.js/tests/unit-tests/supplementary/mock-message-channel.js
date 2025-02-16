class MessagePort {
  onmessage = null;

  constructor(channel) {
    this.channel = channel;
  }

  start() {}

  close() {}

  postMessage(msg) {
    const otherPort =
      this.channel.port1 === this ? this.channel.port2 : this.channel.port1;
    setTimeout(() => {
      if (otherPort.onmessage) {
        otherPort.onmessage(msg);
      }
    }, 1);
  }
}

window.MessageChannel = class {
  constructor() {
    this.port1 = new MessagePort(this);
    this.port2 = new MessagePort(this);
  }
};

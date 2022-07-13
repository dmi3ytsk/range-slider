class Observer {
  constructor(readonly listeners: any = { event: [] }) {
    this.listeners = listeners;
  }
  // crlf-lf bug;

  public subscribe(event: string, callback: {}) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
  }

  public broadcast(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback: (spec: any) => void) => callback(data));
    }
  }
}

export default Observer;

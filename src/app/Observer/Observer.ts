class Observer {
  constructor(readonly listeners: any = { listener: [] }) {}

  public subscribe(event: string, callback) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
  }

  public broadcast(event: string, data: any) {
    // this.listeners[event].data.forEach((listener) => listener(data));
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback: (data: {}) => void) =>
        callback(data),
      );
    }
  }
}

export default Observer;

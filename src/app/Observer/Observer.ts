class Observer {

   constructor(readonly listeners: any = { listener: [] }) {
      
   }

	// Подписаться.
	public subscribe(event: string, callback: Function) {
		this.listeners[event].data.push(callback);
	}

	// Разослать сообщение подписчикам.
	public broadcast(event: string, data: any) {
		this.listeners[event].data.forEach(listener => listener(data));
	}
}

export default Observer;
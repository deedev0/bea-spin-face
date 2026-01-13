const Ziggy = {"url":"https:\/\/bea-spin.my.id","port":null,"defaults":{},"routes":{"guest.index":{"uri":"guest","methods":["GET","HEAD"]},"guest.create":{"uri":"guest\/create","methods":["GET","HEAD"]},"guest.store":{"uri":"guest","methods":["POST"]},"guest.show":{"uri":"guest\/{guest}","methods":["GET","HEAD"],"parameters":["guest"],"bindings":{"guest":"id"}},"guest.update":{"uri":"guest\/{guest}","methods":["PUT","PATCH"],"parameters":["guest"],"bindings":{"guest":"id"}},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };

class Module {
    constructor({ io, SOCKETS_EVENTS, db, mediator }) {
        this.io = io;
        this.db = db;
        this.SOCKETS_EVENTS = SOCKETS_EVENTS;
    }
}

module.exports = Module;
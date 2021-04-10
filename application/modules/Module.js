class Module {
    constructor({ io, MESSAGES, db, HOST, UPLOADS, PATH_TO_DIR, mediator }) {
        this.io = io;
        this.db = db;
        this.mediator = mediator;
        this.MESSAGES = MESSAGES;
        this.HOST = HOST;
        this.UPLOADS = UPLOADS;
        this.PATH_TO_DIR = PATH_TO_DIR;
        this.EVENTS = mediator.getEventTypes();
        this.TRIGGERS = mediator.getTriggerTypes();
    }
}

module.exports = Module;
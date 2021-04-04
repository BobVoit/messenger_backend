class Module {
    constructor({ io, MESSAGES, db, HOST, UPLOADS, PATH_TO_DIR }) {
        this.io = io;
        this.db = db;
        this.MESSAGES = MESSAGES;
        this.HOST = HOST;
        this.UPLOADS = UPLOADS;
        this.PATH_TO_DIR = PATH_TO_DIR;
    }
}

module.exports = Module;
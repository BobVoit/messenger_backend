const Module = require('../Module');


class ChatManager extends Module {
    constructor(options) {
        super(options);

        this.io.on('connection', socket => {

            socket.on('message', data => {
                console.log('message:  ', data);
                socket.broadcast.emit('message', data);
            })

            
            socket.on(this.MESSAGES.PRIVATE_MESSAGE, async data => await this.privateMessage(data, socket));
            socket.on(this.MESSAGES.GET_ALL_MESSAGES, async data => await this.getAllMessages(data, socket));
            
        })
    }

    // получить все сообщения между пользователями
    async getAllMessages({ from, to }, socket) {
        const messages = await this.db.getAllMessages(to, from);
        if (messages instanceof Array) {
            socket.emit(this.MESSAGES.GET_ALL_MESSAGES, messages);
        }
    }

    async privateMessage({ text, date, time, from, to, socketIdTo }, socket) {
        console.log(text, date, time, from, to, socketIdTo);
        if (await this.db.saveMessage(text, date, time, to, from)) {
            const message = await this.db.getMessageByTimeAndDate(time, date);
            socket.to(socketIdTo).emit(this.MESSAGES.PRIVATE_MESSAGE, message);
            socket.emit(this.MESSAGES.PRIVATE_MESSAGE, message);
        }
    }

}


module.exports = ChatManager;
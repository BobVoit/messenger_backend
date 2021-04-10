const Module = require('../Module');


class ChatManager extends Module {
    constructor(options) {
        super(options);

        this.io.on('connection', socket => {

            socket.on('message', data => {
                console.log('message:  ', data);
                socket.broadcast.emit('message', data);
            })

            // socket.on('disconnect', () => console.log(`${socket.id} disconnected!`));
        })
        console.log(this.mediator);
    }
}


module.exports = ChatManager;
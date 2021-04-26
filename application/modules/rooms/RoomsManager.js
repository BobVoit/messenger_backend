const Module = require('../Module');

class RoomsManager extends Module {
    constructor(options) {
        super(options);
        this.rooms = {};
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.CREATE_ROOM, async (data) => this.createRoom(data, socket));
            socket.on(this.MESSAGES.GET_ROOMS, () => this.getAllRooms(socket));
            socket.on(this.MESSAGES.JOIN_ROOM, data => this.joinRoom(data, socket)); // data { room, userId }
            socket.on(this.MESSAGES.LEAVE_ROOM, data => this.leaveRoom(data, socket)); // data { room, userId }
            socket.on(this.MESSAGES.GET_ALL_MESSAGES_IN_ROOM, data => this.getAllMessagesInRoom(data, socket)); // data - room
            socket.on(this.MESSAGES.SEND_NEW_MESSAGE_IN_ROOM, data => this.sendMessage(data, socket)); // data { room, messageData }
        })

        this.io.of('/').adapter.on('create-room', room => {
            console.log(`${room} was created`);
        })

        this.io.of("/").adapter.on('delete-room', room => {
            if(room in this.rooms) {
                delete this.rooms[room];
            }
            console.log(`${room} was deleted`);
        });

        this.io.of("/").adapter.on("join-room", (room, id) => {
            console.log(`socket ${id} has joined room ${room}`);
        });

        this.io.of("/").adapter.on("leave-room", (room, id) => {
            console.log(`socket ${id} has leaved room ${room}`);
        });
    }


    getAllRooms(socket) {
        socket.emit(this.MESSAGES.GET_ROOMS, Object.values(this.rooms));
    }

    // room - название комнаты
    // создание комнаты
    async createRoom(room, socket) {
        let data = { result: false };
        if (!(room in this.rooms)) {
            await this.db.createRoom(room);
            const dbRoom = await this.db.getRoomByTitle(room);
            if (dbRoom) {
                this.rooms[dbRoom.title] = dbRoom;
                socket.join(room);
                data = { result: true, room: dbRoom };
            }
        }
        socket.emit(this.MESSAGES.CREATE_ROOM, data);
        socket.broadcast.emit(this.MESSAGES.CREATE_ROOM, data);
        console.log("Комнаты: ", this.rooms);
    }

    // войти в комнату
    async joinRoom({room, userId}, socket) {
        let data = { result: false };
        if (room in this.rooms) {
            socket.join(room);
            const roomId = this.rooms[room].id;
            const result = await this.db.addUserInRoom(roomId, userId);
            if (result) {
                const dbRoom = await this.db.getRoomByTitle(room);   
                if (dbRoom) {
                    socket.join(room);
                    data = { result: true, room: dbRoom };
                }
            } 
        }
        socket.emit(this.MESSAGES.JOIN_ROOM, data);
    }

    // выйти в комнату
    async leaveRoom({room, userId}, socket) {
        let data = { result: false };
        if (room in this.rooms) {
            const result = await this.db.deleteUserFromRoom(userId);
            if (result) {
                socket.leave(room);
                data = { result: true};
            }
        }
        socket.emit(this.MESSAGES.LEAVE_ROOM, data);
    }

    // получить все сообщения из комнаты
    async getAllMessagesInRoom(room, socket) {
        let data = { result: false };
        if (room in this.rooms) {
            const roomId = this.rooms[room].id;
            const messages = await this.db.getMessageFromRoom(roomId);
            if (messages instanceof Array) {
                data = { result: true, messages};
            }
        }
        socket.emit(this.MESSAGES.GET_ALL_MESSAGES_IN_ROOM, data);
    }

    // добавить новое сообщение
    async sendMessage({room, messageData}, socket) {
        let data = { result: false };
        if (room in this.rooms) {
            const result = await this.db.addNewMessageForRoom(messageData);
            if (result) {
                const message = this.db.getMessageFromRoomByDateAndTime(messageData.date, messageData.time);
                data = { result: true, message };
            }
        }
        this.io.to(room).emit(this.MESSAGES.SEND_NEW_MESSAGE_IN_ROOM, data);
    }

    getRooms(socket) {
        socket.emit(this.MESSAGES.GET_ROOMS, this.rooms);
    }

    async end() {
        await this.db.deleteAllRooms();
    }
}


module.exports = RoomsManager;
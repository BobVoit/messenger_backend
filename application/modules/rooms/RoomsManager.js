const Module = require('../Module');

class RoomsManager extends Module {
    constructor(options) {
        super(options);
        this.rooms = {};
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.CREATE_ROOM, async (data) => this.createRoom(data, socket));
            socket.on(this.MESSAGES.GET_ROOMS, () => this.getAllRooms(socket));
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
        console.log("Комнаты: ", this.rooms);
    }

    joinRoom(room, socket) {
        let data = { result: false };
        if(room in this.rooms) {
            socket.join(room);
            data = {result: true, room};            
        }
        socket.emit(this.MESSAGES.JOIN_ROOM, data);
    }

    leaveRoom(room, socket) {
        let data = { result: false };
        if (room in this.rooms) {
            socket.leave(room);
            data = { result: true};
        }
        socket.emit(this.MESSAGES.LEAVE_ROOM, data);
    }

    getRooms(socket) {
        socket.emit(this.MESSAGES.GET_ROOMS, this.rooms);
    }

    async end() {
        await this.db.deleteAllRooms();
    }
}


module.exports = RoomsManager;
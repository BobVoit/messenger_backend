const path = require('path');

const SETTINGS = {
    HOST: 'http://localhost:3001',
    PORT: 3001,
    UPLOADS: {
        IMAGES: 'uploads/images'
    },
    PATH_TO_DIR: path.dirname(__filename), 

    // события сокетов
    MESSAGES: {
        GET_USER_DATA: 'GET_USER_DATA',
        SET_CONNECT: 'SET_CONNECT', 
        GET_ALL_ACTIVE_USERS: 'GET_ALL_ACTIVE_USERS',
        USER_CONNECT: 'USER_CONNECT',
        USER_DISCONNECT: 'USER_DISCONNECT',
        PRIVATE_MESSAGE: 'PRIVATE_MESSAGE',
        GET_ALL_MESSAGES: 'GET_ALL_MESSAGES',
        REQUEST_IN_FRIENDS: 'REQUEST_IN_FRIENDS',
        ADD_IN_FRIENDS: 'ADD_IN_FRIENDS',
        CREATE_ROOM: 'CREATE_ROOM',
        JOIN_ROOM: 'JOIN_ROOM',
        LEAVE_ROOM: 'LEAVE_ROOM',
        GET_ROOMS: 'GET_ROOMS',
        NEW_ROOM: 'NEW_ROOM',
        SEND_NEW_MESSAGE_IN_ROOM: 'SEND_NEW_MESSAGE_IN_ROOM',
        GET_ALL_MESSAGES_IN_ROOM: 'GET_ALL_MESSAGES_IN_ROOM'
    },

    MEDIATOR: {
        EVENTS: {
            USER_CONNECT: 'USER_CONNECT',
            USER_DISCONNECT: 'USER_DISCONNECT',
            USER_JOIN_IN_ROOM: 'USER_JOIN_IN_ROOM'
        },
        TRIGGERS: {
            GET_ALL_USERS: 'GET_ALL_USERS'
        }
    }
}

module.exports = SETTINGS;
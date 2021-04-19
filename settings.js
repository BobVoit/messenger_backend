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
        JOIN_IN_ROOM: 'JOIN_IN_ROOM',
        LEAVE_ROOM: 'LEAVE_ROOM',
        GET_ROOMS: 'GET__ROOMS',
    },

    MEDIATOR: {
        EVENTS: {
            USER_CONNECT: 'USER_CONNECT',
            USER_DISCONNECT: 'USER_DISCONNECT'
        },
        TRIGGERS: {
            GET_ALL_USERS: 'GET_ALL_USERS'
        }
    }
}

module.exports = SETTINGS;
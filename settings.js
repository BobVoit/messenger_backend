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
        LOGIN: 'LOGIN',
        REGISTRATION: 'REGISTRATION',
        LOGOUT: 'LOGOUT',
        GET_USER_DATA: 'GET_USER_DATA',
        SET_CONNECT: 'SET_CONNECT', 
        GET_ALL_ACTIVE_USERS: 'GET_ALL_ACTIVE_USERS',
        USER_CONNECT: 'USER_CONNECT',
        USER_DISCONNECT: 'USER_DISCONNECT',
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
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
        GET_USER_DATA: 'GET_USER_DATA'
    },
}

module.exports = SETTINGS;
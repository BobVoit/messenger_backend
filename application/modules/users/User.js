const md5 = require('md5');

class User {
    constructor({ id, login, password, nickname, token, avatar, socketId }) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.nickname = nickname;
        this.token = token;
        this.avatar = avatar;
        this.socketId = socketId;
    }

    fill({ id, login, password, nickname, token, avatar, socketId }) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.nickname = nickname;
        this.token = token;
        this.avatar = avatar;
        this.socketId = socketId;
    }

    self() {
        return {
            id: this.id,
            login: this.login, 
            password: this.password,
            nickname: this.nickname,
            token: this.token,
            avatar: this.avatar,
            socketId: this.socketId,
        }
    }

    get() {
        return {
            id: this.id,
            nickname: this.nickname
        }
    }

}

module.exports = User;
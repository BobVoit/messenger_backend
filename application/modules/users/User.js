const md5 = require('md5');

class User {
    constructor(db) {
        this.db = db;
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

    // устанавливает статус online для пользователя с token
    async setOnlineStatus(userId) {
        if (userId) {
            const result = await this.db.updateUserStatus(userId, 'online');
            if (result) {
                return true;
            }
        }
        return false;
    }

    // устанавливает статус offline для пользователя с token
    async setOfflineStatus(userId) {
        if (userId) {
            const result = await this.db.updateUserStatus(userId, 'offline');
            if (result) {
                return true;
            }
        }
        return false;
    }

    // установить id соединения
    async setSocketId(userId, socketId) {
        if (userId && socketId) {
            const result = await this.db.setSocketId(userId, socketId);
            if (result) {
                return true;
            }
        }
        return false;
    }

    async removeSocketId(userId) {
        if (userId) {
            const result = await this.db.removeSocketId(userId);
            if (result) {
                return true;
            }
        }
        return false;
    }

}

module.exports = User;
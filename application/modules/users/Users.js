const Module = require('../Module');
const md5 = require('md5');
const Answer = require('../../routers/Answer');



class Users extends Module {
    constructor(options) {
        super(options);

        this.answer = new Answer();
        
    }

    // авторизация пользователя
    async login(data) {
        const { login, passHash, token, num } = data;
        if (login && passHash && token && num) {
            if (token === md5(passHash + num)) {
                const user = await this.db.getUserByLogin(login);
                if (user && passHash === user.password) {
                    const result = await this.db.updateUserToken(user.id, token);
                    if (result) {
                        this.db.updateUserStatus(user.id, 'online');
                        return token;
                    }
                }
            }
        } 
    }

    // регистрация нового пользователя
    async registration(data) {
        const { login, nickname, passHash, token, num } = data;
        if (login && nickname && passHash && token && num) {
            if (token === md5(passHash + num)) {
                const user = await this.db.getUserByLogin(login);
                if (!user) {
                    const result = await this.db.addUser(login, nickname, passHash, token);
                    console.log(token);
                    if (result) {
                        return token;
                    }
                }
            }
        }
    }

    // получить данные о пользователе
    async getUserData(data) {
        console.log("getUserData", data);
        const { token } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            return user;
        }
    }

    // выход из акаунтаx
    async logout(data) {
        const { token } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const result = await this.db.updateUserToken(user.id, null);
                if (result) {
                    this.db.updateUserStatus(user.id, 'offline');
                    return true;
                }
            }
        }
    }


    // set user status offline
    async setOfflineUser(data, socket) {
        const { token } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const result = await this.db.updateUserStatus(user.id, 'offline');
                socket.emit('disconnect', 'offline');
            }
        }
    }

}

module.exports = Users;
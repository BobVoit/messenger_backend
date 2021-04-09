const Module = require('../Module');
const md5 = require('md5');
const User = require('./User');
const Answer = require('../../routers/Answer');
const fs = require('fs');


class Users extends Module {
    constructor(options) {
        super(options);
        this.answer = new Answer();

        this.users = {};

        this.io.on('connect', (socket) => console.log(`${socket.id} connected`));

        this.io.on('connection', async (socket) => {
            

            socket.on(this.MESSAGES.SET_CONNECT, async data => this.connect(data.token, socket));


            socket.on('disconnecting', async () => this.disconnecting(socket));
            socket.on('disconnect', () => {
                console.log(`${socket.id} disconnected!`);
            });
        })
    }

    // *****************************************
    // Вспомогательные методы для устанвления путей к фото
    // *****************************************

    getPathToUploadImage(fileName) {
        return `${this.HOST}/${this.UPLOADS.IMAGES}/${fileName}`;
    }

    getFullPathToUploadImage(fileName) {
        return `${this.PATH_TO_DIR}/${this.UPLOADS.IMAGES}/${fileName}`;
    }

    // *****************************************
    // Методы для API запросовы
    // *****************************************

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
        return false;
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
        return false;
    }

    // получить данные о пользователе
    async getUserData(data) {
        console.log("getUserData", data);
        const { token } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const avatar = await this.db.getAvatar(user.id);
                const aboutText = await this.db.getDataAboutUser(user.id);  
                return { ...user, ...aboutText, avatar: avatar ? this.getPathToUploadImage(avatar.filename) : null };
            }
        }
        return false;
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
        return false;
    }

    // добавить аватар пользователю
    async saveAvatar(data) {
        const { token, avatar } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const result = await this.db.saveAvatar(user.id, avatar.filename);
                console.log(this.getPathToUploadImage(avatar.filename));
                return this.getPathToUploadImage(avatar.filename);
            }
        }
        return false;
    }

    // получить пользовательский аватар
    async getUserAvatar(data) {
        const { token } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const result = await this.db.getAvatar(user.id);
                if (result) {
                    const avatar = this.getPathToUploadImage(result.filename);
                    return avatar;
                }
            }
        }
        return false;
    }

    // обновить аватар пользователя
    async updateUserAvatar(data) {
        const { token, avatar } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const prevAvatar = await this.db.getAvatar(user.id);
                let result;
                try {
                    fs.unlinkSync(this.getFullPathToUploadImage(prevAvatar.filename));
                    result = await this.db.updateUserAvatar(user.id, avatar.filename);
                } catch (err) {
                    console.error(err);
                }
                if (result) {
                    return this.getPathToUploadImage(avatar.filename);
                }
            }
        }
        return false;
    }

    // удалить аватар пользователя
    async deleteUserAvatar(data) {
        const { token } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const avatar = await this.db.getAvatar(user.id);
                let result;
                try {
                    fs.unlinkSync(this.getFullPathToUploadImage(avatar.filename));
                    result = await this.db.deleteUserAvatar(user.id);
                } catch (err) {
                    console.error(err);
                }
                return result ? true : false;
            }
        }
        return false;
    }

    // обновить никнейм
    async updateUserNickname(data) {
        const { nickname, token } = data;
        if (nickname && token) {
            const result = await this.db.updateUserNickname(token, nickname);
            console.log(result);
            if (result) {
                return nickname;
            }
        }
        return false;
    }

    // добавление текста о пользователе
    async setTextAboutUser(data) {
        const { aboutText, token } = data;
        // console.log(typeof aboutText);
        if (token && (data || data === "")) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const resultSelectData = await this.db.getDataAboutUser(user.id);
                if (resultSelectData) {
                    const result = await this.db.updateTextAboutUser(user.id, aboutText);
                    if (result) {
                        return aboutText;
                    }
                } else {
                    const result = await this.db.addTextAboutUser(user.id, aboutText);
                    if (result) {
                        return aboutText;
                    }
                }
            }
        }
        return false;
    }

    async getUserAboutText(data) {
        const { token } = data;
        if (token) {
            const user = await this.db.getUserByToken(token);
            if (user) {
                const result = await this.db.getDataAboutUser(user.id);
                if (result) {
                    return result.aboutText;
                }
            }
        }
        return false;
    }


    // *****************************************
    // Методы для Socket IO
    // *****************************************

    // подключения к серверу по ws соединению
    // userId - индификатор пользователя
    // socket - параметры соединению по сокету
    async connect(token, socket) {
        console.log(token, socket.id);
        const user = new User(this.db);
        const userData = await this.db.getUserByToken(token);
        if (userData) {
            this.users[userData.id] = { ...userData, socketId: socket.id };
            await user.setOnlineStatus(userData.id);
            await user.setSocketId(userData.id, socket.id);
        }
        console.log(this.users);
    }


    // отключение ws соединения
    // socket - параметры соединению по сокету
    async disconnecting(socket) {
        const user = new User(this.db);
        const userData = await this.db.getUserBySocketId(socket.id);
        if (userData) {
            delete this.users[userData.id];
            await user.setOfflineStatus(userData.id);
            await user.removeSocketId(userData.id);
        }
        console.log(this.users);
    }


}

module.exports = Users;
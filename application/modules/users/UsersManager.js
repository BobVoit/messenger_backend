const Module = require('../Module');
const md5 = require('md5');
const User = require('./User');
const Answer = require('../../routers/Answer');
const fs = require('fs');


class UsersManager extends Module {
    constructor(options) {
        super(options);
        this.answer = new Answer();
        this.users = {}; // пользователи онлайн

        this.io.on('connect', (socket) => console.log(`${socket.id} connected`));
        this.io.on('connection', async (socket) => {
            socket.on(this.MESSAGES.SET_CONNECT, async data => this.connect(data.token, socket));
            socket.on('disconnecting', async () => this.disconnecting(socket));
            socket.on('disconnect', () => {
                console.log(`${socket.id} disconnected!`);
            });
        })
        this.mediator.set(this.TRIGGERS.GET_ALL_USERS, () => this.users);
    }

    // *****************************************
    // Вспомогательные методы для устанвления путей к фото
    // *****************************************

    getPathToUploadImage(filename) {
        return filename ? `${this.HOST}/${this.UPLOADS.IMAGES}/${filename}` : '';
    }

    getFullPathToUploadImage(filename) {
        return filename ? `${this.PATH_TO_DIR}/${this.UPLOADS.IMAGES}/${filename}` : '';
    }

    // *****************************************
    // Методы для API запросов
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

    // получить текст о пользователе
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

    // удаление пользователя
    async deleteUser(data) {
        const { token } = data;
        const user = await this.db.getUserByToken(token);
        if (user) {
            const result = await this.db.deleteUser(user.id);
            if (result) {
                const avatar = await this.db.getAvatar(user.id);
                if (avatar) {
                    let resultAvatar;
                    try {
                        fs.unlinkSync(this.getFullPathToUploadImage(avatar.filename));
                        resultAvatar = await this.db.deleteUserAvatar(user.id);
                    } catch (err) {
                        console.error(err);
                    }
                    if (resultAvatar) { 
                        return true;
                    }
                }
                return true;
            }
        }
        return false;
    }

    // получить всех пользователей
    async getAllUsers() {
        const users = await this.db.getAllUsers();
        if (users) {
            return users;
        }
        return false;
    }

    // получить первых count пользователей начиная с start
    async getSomeUsers(data) {
        const { userId, count, start } = data;
        const users = await this.db.getUsersInRangeExpectUserId(userId, count, start);
        if (users) {
            return users.map(user => ({ 
                ...user, 
                avatar: user.avatar ? this.getPathToUploadImage(user.avatar) : null
            }));
        }
        return false;
    }

    async getAllFriends(data) {
        const { token } = data;
        const user = await this.db.getUserByToken(token);
        if (user) {
            const friends = await this.db.getAllFriendsByUserId(user.id);
            if (friends) {
                return friends.map(friend => ({ 
                    ...friend, 
                    avatar: friend.avatar ? this.getPathToUploadImage(friend.avatar) : null  
                }));
            }
        }
        return false;
    }

    // получить профиль о пользователе по userId
    async getUserProfile(data) {
        console.log(data);
        const { userId } = data;
        const userProfile = await this.db.getUserProfileById(userId);
        if (userProfile) {
            return { 
                ...userProfile, 
                avatar: userProfile.avatar ? this.getPathToUploadImage(userProfile.avatar) : null  
            }
        }
        return false;
    }

    // запрос в друзья
    async requestInFriends(data) {
        const { fromId, toId } = data;
        const result = await this.db.setRequestInFriends(fromId, toId);
        if (result) {
            return true;
        }
        return false;
    }

    // удалить запрос в друзья
    async deleteRequestInFriends(data) {
        const { id } = data;
        const rowInRequest = await this.db.selectRequestFriendsById(id);
        if (rowInRequest) {
            const result = await this.db.deleteRequestInFriends(id);
            if (result) {
                const user = await this.db.selectUser(rowInRequest.fromId);
                if (user) {
                    return user;
                }
            }
        }
        return false;
    }

    // получить список заявок в друзья
    async getRequestInFriendsForUser(data) {
        const { userId } = data;
        const requestsInFriends = await this.db.getRequestInFriendsForUserById(userId);
        if (requestsInFriends) {
            return requestsInFriends;
        }
        return false;
    }

    // добавить в друзья
    async addInFriends(data) {
        const { fromId, toId } = data;
        const deleteFromFriendsRequests = await this.db.deleteFromFriendsRequests(fromId, toId);
        console.log(data);
        if (deleteFromFriendsRequests) {
            const result = await this.db.addInFriends(fromId, toId);
            if (result) {
                return true;
            }
        }
        return false;
    }

    // *****************************************
    // Методы для Socket IO
    // *****************************************

    // подключения к серверу по ws соединению
    async connect(token, socket) {
        const userData = await this.db.getUserByToken(token); // получить данные о пользователе по токену
        const userAvatar = await this.db.getAvatar(userData.id); // берем аватар пользователя по id
        const avatar = userAvatar ? userAvatar.filename : null; // определяем есть ли аватар или нет
        const user = new User({ ...userData, avatar: this.getPathToUploadImage(avatar), socketId: socket.id }); // заполняем информацию о пользователе
        if (userData) {
            await this.db.updateUserStatus(user.id, 'online'); // делаем статус "online"
            await this.db.setSocketId(user.id, socket.id); // уставливаем socket.IO соединения для между клиентом и сервером
            socket.emit(this.MESSAGES.GET_ALL_ACTIVE_USERS, this.users);
            this.users[user.id] = user;
            socket.broadcast.emit(this.MESSAGES.USER_CONNECT, user);
        }
        console.log(this.users);
    }


    // отключение от сервера по ws соединения
    async disconnecting(socket) {
        const user = new User(this.db);
        const userData = await this.db.getUserBySocketId(socket.id);
        if (userData) {
            await this.db.updateUserStatus(userData.id, 'offline');
            await this.db.removeSocketId(userData.id);
            socket.broadcast.emit(this.MESSAGES.USER_DISCONNECT, this.users[userData.id]);
            delete this.users[userData.id];
        }
        console.log(this.users);
    }


}

module.exports = UsersManager;
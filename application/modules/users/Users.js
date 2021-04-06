const Module = require('../Module');
const md5 = require('md5');
const Answer = require('../../routers/Answer');
const fs = require('fs');


class Users extends Module {
    constructor(options) {
        super(options);

        this.answer = new Answer();
    }

    getPathToUploadImage(fileName) {
        return `${this.HOST}/${this.UPLOADS.IMAGES}/${fileName}`;
    }

    getFullPathToUploadImage(fileName) {
        return `${this.PATH_TO_DIR}/${this.UPLOADS.IMAGES}/${fileName}`;
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
            if (user) {
                const avatar = await this.db.getAvatar(user.id);
                const aboutText = await this.db.getDataAboutUser(user.id);
                return { ...user, ...aboutText, avatar: avatar ? this.getPathToUploadImage(avatar.filename) : null };
            }
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
    }
}

module.exports = Users;
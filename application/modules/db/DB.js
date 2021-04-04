const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

class DB {
    constructor() {
        // connect to database
        (async () => {
            // open database
            this.db = await open({
                filename: './application/modules/db/messenger.db',
                driver: sqlite3.Database
            })
        })();

        // this.db = new sqlite3.Database('./application/modules/db/messanger.db'); 
    }

    // берёт данный пользователя по login
    getUserByLogin(login) {
        const user = this.db.get('SELECT * FROM users WHERE login=?', [login]);
        return user;
    }

    // берёт данный пользователя по token
    getUserByToken(token) {
        const user = this.db.get('SELECT * FROM users WHERE token=?', [token]);
        return user;
    }

    // берёт всех пользователей из базы данных
    getAllUsers() {
        const users = this.db.get('SELECT * FROM users');
        return users;
    }

    // добаляет нового пользователя в таблице users
    addUser(login, nickname, password, token) {
        const result = this.db.run(
            'INSERT INTO users (login, nickname, password, token, status) VALUES (?, ?, ?, ?, ?)',
            [login, nickname, password, token, 'online']
        );
        return result;
    }

    // обновляет токен пользователя
    updateUserToken(id, token) {
        const result = this.db.run(
            'UPDATE users SET token=? WHERE id=?',
            [token, id]
        );
        return result;
    }

    // обновление статуса пользователя
    updateUserStatus(id, status) {
        const result = this.db.run(
            'UPDATE users SET status=? WHERE id=?',
            [status, id]
        );
        return result;
    }

    // удаление токена пользователя
    deleteUserToken(token) {
        return this.db.run(
            "UPDATE users SET token='' WHERE token=?",
            [token]
        );
    }

    // берет все данные о пользователе по userId
    getDataAboutUser(userId) {
        return this.db.get(
            'SELECT usersContent.aboutText FROM users INNER JOIN usersContent ON ? = usersContent.userId',
            [userId]
        );
    }

    // сохраняет аватар пользователя
    saveAvatar(userId, fileName) {
        return this.db.run(
            'INSERT INTO avatars (filename, userId) VALUES (?, ?)',
            [fileName, userId]
        );
    }

    // возвращает аватар пользователя
    getAvatar(userId) {
        return this.db.get(
            'SELECT fileName FROM avatars WHERE userId = ?',
            [userId]
        );
    }
    
    // обновляет аватар пользователя
    updateUserAvatar(userId, filename) {
        return this.db.run(
            'UPDATE avatars SET filename = ? WHERE userId = ?',
            [filename, userId]
        );
    }

    // удаляет аватар пользователя
    deleteUserAvatar(userId) {
        return this.db.run(
            'DELETE FROM avatars WHERE userId = ?',
            [userId]
        );
    }

    // обновить никнейм
    updateUserNickname(token, newNickname) {
        return this.db.run(
            'UPDATE users SET nickname = ? WHERE token = ?',
            [newNickname, token]
        );
    }

    // взять данные об пользователи из таблицы usersContent
    selectDataAboutUser(userId) {
        return this.db.get(
            'SELECT * FROM usersContent WHERE userId = ?',
            [userId]
        );
    }

    // добавить текст о пользователе
    addTextAboutUser(userId, aboutText) {
        return this.db.run(
            'INSERT INTO usersContent (userId, aboutText) VALUES (?, ?)',
            [userId, aboutText]
        );
    }

    // обновить текст о пользователе
    updateTextAboutUser(userId, aboutText) {
        return this.db.run(
            'UPDATE users SET aboutText = ? WHERE userId = ?',
            [aboutText, userId]
        );
    }
}

module.exports = DB;
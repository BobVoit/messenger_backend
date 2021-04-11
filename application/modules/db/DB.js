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
        const users = this.db.all('SELECT * FROM users');
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

    // обновить текст о пользователе
    updateTextAboutUser(userId, aboutText) {
        return this.db.run(
            'UPDATE users SET aboutText = ? WHERE userId = ?',
            [aboutText, userId]
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
            'UPDATE usersContent SET aboutText = ? WHERE userId = ?',
            [aboutText, userId]
        );
    }

    // возвращает объект с полем aboutText
    getDataAboutUser(userId) {
        return this.db.get(
            'SELECT aboutText FROM usersContent WHERE userId = ?',
            [userId]
        );
    }

    // установить socketId ( id подключения )
    setSocketId(id, socketId) {
        return this.db.run(
            'UPDATE users SET socketId = ? WHERE id = ?',
            [socketId, id]
        );
    }

    // удалить socketId из таблицы пользователей c id
    removeSocketId(id) {
        return this.db.run(
            'UPDATE users SET socketId = NULL WHERE id = ?',
            [id]
        );
    }

    // получить данные о пользователе по socketId
    getUserBySocketId(socketId) {
        if (socketId) {
            return this.db.get(
                'SELECT * FROM users WHERE socketId = ?',
                [socketId]
            );
        }   
        return false;
    }

    // удаление пользователя из таблицы
    deleteUser(id) {
        return this.db.run(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
    }

    saveMessage(text, date, time, to, from) {
        return this.db.run(
            'INSERT INTO messages (text, date, time, toId, fromId) VALUES (?, ?, ?, ?, ?)',
            [text, date, time, to, from]
        );
    }

    // получить все сообщения отправленные от
    // пользователя с id from 
    // пользователю с id to
    getAllMessages(toId, fromId) {
        return this.db.all(
            'SELECT * FROM messages WHERE (toId = ? AND fromId = ?) OR (toId = ? AND fromId = ?)',
            [toId, fromId, fromId, toId]
        );
    }

    getMessageByTimeAndDate(time, date) {
        return this.db.get(
            'SELECT * FROM messages WHERE date = ? AND time = ?',
            [date, time]
        );
    }


    // получить первых count пользователей начиная с start
    getUsersInRange(count, start = 0) {
        return this.db.all(
            'SELECT users.id, users.nickname, users.status, avatars.filename AS avatar FROM users LEFT JOIN avatars ON users.id = avatars.userId LIMIT ? OFFSET ?',
            [count, start]
        );
    }
}

module.exports = DB;
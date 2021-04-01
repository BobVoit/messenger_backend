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

    updateUserToken(id, token) {
        const result = this.db.run(
            'UPDATE users SET token=? WHERE id=?',
            [token, id]
        );
        return result;
    }

    updateUserStatus(id, status) {
        const result = this.db.run(
            'UPDATE users SET status=? WHERE id=?',
            [status, id]
        );
        return result;
    }

    deleteUserToken(token) {
        return this.db.run(
            "UPDATE users SET token='' WHERE token=?",
            [token]
        );
    }
}

module.exports = DB;
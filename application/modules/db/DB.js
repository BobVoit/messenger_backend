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

    // сохранить сообщеине
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

    // получить сообщеине по времени и дате
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

    // получить первых count пользователей начиная с start за исключением пользователя с userId
    getUsersInRangeExpectUserId(userId, count, start = 0) {
        return this.db.all(
            'SELECT users.id, users.nickname, users.nickname, users.status, avatars.filename as avatar FROM users LEFT JOIN avatars ON users.id = avatars.userId WHERE users.id <> ? LIMIT ? OFFSET ?',
            [userId, count, start]
        );
    }

    // получить друзей пользователя с userId
    getAllFriendsByUserId(userId) {
        return this.db.all(
            'SELECT users.id, users.nickname, avatars.filename as avatar, status FROM users LEFT JOIN avatars ON users.id = avatars.userId INNER JOIN friends ON users.id = friends.friendId WHERE friends.userId = ?',
            [userId]
        );
    }

    // добавить в таблицу друзей
    addFriend(firstUserId, secondFriendId) {
        return this.db.run(
            'INSERT INTO friends (userId, friendId) VALUES (?, ?), (?, ?)',
            [firstUserId, secondFriendId, secondFriendId, firstUserId]
        )
    }

    // добавить в таблицу запросы в друзья
    addInRequestFriend(fromId, toId) {
        return this.db.run(
            'INSERT INTO friendRequests (fromId, toId) VALUES (?, ?)',
            [fromId, toId]
        );
    }

    // получить профиль пользователя по userId
    getUserProfileById(userId) {
        return this.db.get(
            'SELECT users.id as id, users.nickname as nickname, avatars.filename as avatar, users.status as status, usersContent.aboutText as aboutText FROM users LEFT JOIN avatars ON users.id = avatars.userId LEFT JOIN usersContent ON users.id = usersContent.userId WHERE users.id = ?',
            [userId]
        );
    }

    // установить запрос в друзья
    setRequestInFriends(fromId, toId) {
        return this.db.run(
            'INSERT INTO requestInFriend (fromId, toId) VALUES (?, ?)',
            [fromId, toId]
        );
    }

    // удалить запрос в друзья
    deleteRequestInFriends(id) {
        return this.db.run(
            'DELETE FROM requestInFriend WHERE id = ?',
            [id]
        );
    }

    // взять пользователя по toId
    // использовать для списка пользователей или друзей
    selectUser(userId) {
        return this.db.get(
            'SELECT users.id, users.nickname, users.status, avatars.filename as avatar FROM users LEFT JOIN avatars ON users.id = avatars.userId WHERE users.id = ?',
            [userId]
        );
    }

    
    selectRequestFriendsById(id) {
        return this.db.get(
            'SELECT * FROM requestInFriend WHERE id = ?',
            [id]
        )
    }

    // получить список заявок в друзья
    getRequestInFriendsForUserById(userId) {
        return this.db.all(
            'SELECT users.id, users.nickname, users.status FROM users INNER JOIN requestInFriend ON users.id = requestInFriend.fromId WHERE requestInFriend.toId = ?',
            [userId]
        );
    }

    // удаляет запрос в друзья
    // fromId - id от кого был отправлен запрос в друзья
    // toId - id кому был отправлен запрос в друзья
    deleteFromFriendsRequests(fromId, toId) {
        return this.db.run(
            'DELETE FROM requestInFriend WHERE fromId = ? AND toId = ?',
            [fromId, toId]
        );
    }

    // добавляет в друзья пользователей
    addInFriends(firstUserId, secondUserId) {
        return this.db.run(
            'INSERT INTO friends (userId, friendId) VALUES (?, ?), (?, ?)',
            [firstUserId, secondUserId, secondUserId, firstUserId]
        );
    }


    // **********************************
    // для работы с комнатами
    // **********************************

    // создать комнату
    createRoom(title) {
        return this.db.run(
            'INSERT INTO rooms (title) VALUES (?)',
            [title]
        );
    }

    // добавить юзера в комнату
    addUserInRoom(roomId, userId) {
        return this.db.run(
            'INSERT INTO usersAndRooms (roomId, userId) VALUES (?, ?)',
            [roomId, userId]
        );
    }

    // добавить сообщеиние в комнату
    addNewMessageForRoom({ text, date, time, fromId, roomId }) {
        return this.db.run(
            'INSERT INTO roomsMessages (text, date, time, fromId, roomId) VALUES (?, ?, ?, ?, ?)',
            [text, date, time, fromId, roomId]
        );
    }   

    // получить все комнаты
    getAllRooms() {
        return this.db.all('SELECT * FROM rooms');
    }

    // Взять юзеров из одной комнаты
    getUsersFromOneRoom(roomId) {
        return this.db.all(
            'SELECT * FROM users INNER JOIN usersAndRooms ON users.id = usersAndRooms.userId WHERE usersAndRooms.roomId = ?',
            [roomId]
        );
    }

    // Взять комнаты, в которых состоит юзер
    getRoomsWhereAreUser(userId) {
        return this.db.all(
            'SELECT * FROM rooms INNER JOIN usersAndRooms ON rooms.id = usersAndRooms.roomId WHERE usersAndRooms.userId = ?',
            [userId]
        );
    }

    // удалить комнату
    deleteRoom(roomId) {
        return this.db.run('DELETE FROM rooms WHERE id = ?', [roomId]);
    }

}

module.exports = DB;
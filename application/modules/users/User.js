

class User {
    constructor(db) {
        this.db = db;
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
const express = require('express');
const router = express.Router();
const multer = require('multer');
const os =require('os');
const SETTINGS = require('../../settings');
const uploadAvatar = require('../modules/Multer/multer');

const Answer = require('./Answer');


function Router({ users }) {
    const answer = new Answer;

    const upload = uploadAvatar;
    
    // регистрация
    router.post('/auth/registration', async (req, res) => {
        const value = await users.registration(req.body);
        res.send(answer.good(value));
    });

    // авторизация
    router.post('/auth/login', async (req, res) => {
        const value = await users.login(req.body);
        res.json(answer.good(value));
    });

    // выход
    router.get('/auth/logout/:token', async (req, res) => {
        const value = await users.logout(req.params);
        res.json(answer.good(value));
    })


    // получить данные о пользователе по токену
    router.get('/users/getUserData/:token', async (req, res) => {
        const value = await users.getUserData(req.params);
        res.json(answer.good(value));
    });

    // обновить никнейм
    router.post('/users/updateNickname', async (req, res) => {
        const value = await users.updateUserNickname(req.body);
        res.json(answer.good(value));
    })

    // добавление аватара
    router.post('/avatar/saveAvatar', upload, async (req, res) => {
        const value = await users.saveAvatar({ avatar: req.file, ...req.body });
        res.json(answer.good(value));
    })  

    // получить автар по токену
    router.get('/avatar/getUserAvatar/:token', async (req, res) => {
        const value = await users.getUserAvatar(req.params);
        res.json(answer.good(value));
    }) 

    // обновить аватар
    router.post('/avatar/updateAvatar', upload, async (req, res) => {
        const value = await users.updateUserAvatar({ avatar: req.file, ...req.body });
        res.json(answer.good(value));
    }) 

    // удалить аватар
    router.get('/avatar/deleteAvatar/:token', async (req, res) => {
        const value = await users.deleteUserAvatar(req.params);
        res.json(answer.good(value));
    })
    
    // устанавливает значение для текста о пользователе
    router.post('/users/updateAboutText', async (req, res) => {
        const value = await users.setTextAboutUser(req.body);
        res.json(answer.good(value));
    })

    
    router.get('/users/getAboutText/:token', async (req, res) => {
        const value = await users.getUserAboutText(req.params);
        res.json(answer.good(value));
    })


    router.all('/*', (req, res) => res.send(answer.bad(404)));
    return router;
}

module.exports = Router;
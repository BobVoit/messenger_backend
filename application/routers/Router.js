const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const Answer = require('./Answer');

function Router({ users }) {
    const answer = new Answer;
    
    // регистрация
    router.post('/auth/registration', async (req, res) => {
        const data = req.body;
        const value = await users.registration(data);
        res.send(answer.good(value));
    });

    // авторизация
    router.post('/auth/login', async (req, res) => {
        const data = req.body;
        const value = await users.login(data);
        res.send(answer.good(value));
    })

    // выход
    router.get('/auth/logout/:token', async (req, res) => {
        const data = req.params;
        const value = await users.logout(data);
        res.send(answer.good(value));
    })


    // получить данные по токену
    router.get('/users/getUserData/:token', async (req, res) => {
        const data = req.params;
        const value = await users.getUserData(data);
        res.send(answer.good(value));
    });



    router.post('/hello', (req, res) => {
        const { name, surname } = req.body;
        res.send(`Hello ${name} ${surname}`);
    })

    router.all('/*', (req, res) => res.send(answer.bad(404)));
    return router;
}

module.exports = Router;
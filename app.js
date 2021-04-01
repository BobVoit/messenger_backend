const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express(); // create server
const server = http.createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
        // origin: "http://localhost:4200",
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const SETTINGS = require('./settings');
const { PORT, SOCKETS_EVENTS } = SETTINGS;

const DB = require('./application/modules/db/DB');
const Users = require('./application/modules/users/Users');

const db = new DB();
const users = new Users({ io, SOCKETS_EVENTS, db });


const Router = require('./application/routers/Router');
const router = new Router({ users });

app.use(
    bodyParser.urlencoded({ extended: true}),
    express.static(__dirname + '/public'),
);
app.use(bodyParser.json());
app.use(cors());

app.use('/', router);

server.listen(PORT, () => console.log(`Server running at port ${PORT}. http://localhost:3001`));
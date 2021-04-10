const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express(); // create server
const server = http.createServer(app);
const cors = require('cors');
const path = require('path');
const io = require('socket.io')(server, {
    cors: {
        // origin: "http://localhost:4200",
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const SETTINGS = require('./settings');
const { PORT, MESSAGES, HOST, UPLOADS, PATH_TO_DIR, MEDIATOR } = SETTINGS;


const DB = require('./application/modules/db/DB');
const UsersManager = require('./application/modules/users/UsersManager');
const ChatManager = require('./application/modules/chat/ChatManager');
const Mediator = require('./application/modules/Mediator');


const db = new DB();
const mediator = new Mediator(MEDIATOR);
const users = new UsersManager({ io, MESSAGES, db, HOST, UPLOADS, PATH_TO_DIR, mediator });
const chat = new ChatManager({ io, MESSAGES, db, mediator });

const Router = require('./application/routers/Router');
const router = new Router({ users });

app.use(
    bodyParser.urlencoded({ extended: true}),
    express.static(__dirname + '/public'),
);
app.use('/uploads', express.static('uploads')); 

app.use(bodyParser.json());
app.use(cors());

app.use('/', router);


server.listen(PORT, () => console.log(`Server running at port ${PORT}. http://localhost:3001`));
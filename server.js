const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
})

const MAX_TIME_MS = 5000;
const CHECK_INTERVAL_MS = 100;

app.post('/ajax', (req, res) => {
    let timeStarted = Date.now();
    const current = latestMessage;
    function checkForChange() {
        if (current !== latestMessage) {
            res.json(latestMessage);
        } else if (Date.now() - timeStarted < MAX_TIME_MS) {
            setTimeout(checkForChange, CHECK_INTERVAL_MS);
        } else {
            res.end();
        }
    }
    setTimeout(checkForChange, CHECK_INTERVAL_MS);
});

app.post('/ajax_system', (req, res) => {
    let timeStarted = Date.now();
    const current = latestSystemMessage;
    function checkForChange() {
        if (current !== latestSystemMessage) {
            res.json(latestSystemMessage);
        } else if (Date.now() - timeStarted < MAX_TIME_MS) {
            setTimeout(checkForChange, CHECK_INTERVAL_MS);
        } else {
            res.end();
        }
    }
    setTimeout(checkForChange, CHECK_INTERVAL_MS);
});

let latestMessage = {
    message: 'witaj',
};
let latestSystemMessage;

const EVENTS = {
    USER_QUIT: 'USER_QUIT',
    NICKNAME_CHANGE: 'NICKNAME_CHANGE',
    COLOR_CHANGE: 'COLOR_CHANGE',

};
Object.freeze(EVENTS);

app.post('/send', (req, res) => {
    let { nickname, message, color } = req.body;

    if (message === '/quit') {
        latestSystemMessage = {
            type: EVENTS.USER_QUIT,
            nickname: escapeString(nickname),
            event_value: null,
            time: Date.now(),
        };
    } else if (/^\/color ([0-9]|[a-f]|[A-F]){6}$/.test(message)) {
        latestSystemMessage = {
            type: EVENTS.COLOR_CHANGE,
            nickname: escapeString(nickname),
            event_value: escapeString(message.substring(message.indexOf(' ') + 1)),
            time: Date.now(),
        };
    } else if (/^\/nick .+$/.test(message)) {
        latestSystemMessage = {
            type: EVENTS.NICKNAME_CHANGE,
            nickname: escapeString(nickname),
            event_value: escapeString(message.substring(message.indexOf(' ') + 1)),
            time: Date.now(),
        };
    } else {
        latestMessage = {
            nickname: escapeString(nickname),
            message: escapeString(message),
            color: escapeString(color),
            time: Date.now(),
        };
    }
    res.end();
});

app.use(express.static('static'));

app.use((req, res) => {
    res.sendStatus(404);
});


function escapeString(string) {
    return string
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&sol;')
        .replace(/\\/g, '&bsol;');
}

app.listen(PORT);

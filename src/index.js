require('dotenv').config({path: './.env'});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const fs = require('fs');
const path = require('path');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.use((_, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use('/static', express.static(path.join(__dirname, 'static/real')));
app.use('/static', express.static(path.join(__dirname, 'static/fake')));

app.get('/', (_, res) => {
    const endpoint = Math.random() < 0.5 ? 'real' : 'fake';
    const file_path = `static/${endpoint}`;

    fs.readdir(path.join(__dirname, file_path), (err, files) => {
        if (err) {
            res.status(500).send("Unable to find an image.");
        } else {
            const file = files[Math.floor(Math.random() * files.length)];

            res.send({
                url: `/static/${file}`,
                fake: endpoint === 'fake' ? true : false,
            });
        }
    });
});

app.listen(process.env.PORT, () => {
  console.log('listening on port ' + process.env.PORT);
});
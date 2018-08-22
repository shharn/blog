var express = require('express');
var path = require('path');
var multer = require('multer');
var chalk = require('chalk');
var mkdirp = require('mkdirp');

var PORT = 3000;
const ASSET_DIR = '../public/asset/image';

var storage = multer.diskStorage({
    destination: (_, __, cb) => {
        var res = mkdirp.sync(path.resolve(__dirname, ASSET_DIR));
        cb(null, path.resolve(__dirname, ASSET_DIR))
    },
    filename: (_, file, cb) => {
        cb(null, file.fieldname);
    }
});

var upload = multer({
    storage
});
var app = express();

app.use(express.static(path.resolve(__dirname, '../public/app')));
app.use('/image', express.static(path.resolve(__dirname, '../public/asset/image')));
app.post('/upload', upload.any(), (_, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(chalk.green(`Front-server is running on port ${PORT}`));
});

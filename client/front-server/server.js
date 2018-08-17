var express = require('express');
var path = require('path');
var multer = require('multer');
var chalk = require('chalk');

var PORT = 3000;

var storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, path.resolve(__dirname, '../public/asset/image'))
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
    res.sendState(200);
});

app.listen(PORT, () => {
    console.log(chalk.green(`Front-server is running on port ${PORT}`));
});

import multer from 'multer';
import path from 'path';
import { Storage } from '@google-cloud/storage';
import logger from './logger';

const PROJECT_ID = process.env.PROJECT_ID;
const BUCKET_NAME = process.env.BUCKET_NAME;
const FOLDER_NAME = process.env.IMAGE_FOLDER_NAME;

const storage = new Storage({
    projectId: PROJECT_ID
});
const bucket = storage.bucket(BUCKET_NAME)
const imageExts = [ '.jpg', '.png', '.jpeg', '.gif' ];

export const uploader = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        if (imageExts.includes(ext)) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'), false);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export function uploadeImage(req, _, next) {
    if (!req.files) {
        return next();
    }
    req.files.forEach(file => {
        const fileName = file.originalname;
        const fileObj = bucket.file(`${FOLDER_NAME}/${fileName}`);
        const stream = fileObj.createWriteStream({
            gzip: true,
            metadata: {
                contentType: file.mimetype,
            },
            resumable: false
        }).on('error', err => {
            console.log(`stream.on(error). error : ${err.toString}`);
            logger.error(`Error during streaming the file. Error : ${err.message}`);
            file.cloudStorageError = err;
            next(err);
        }).on('finish', () => {
            console.log('string.on(finish');
            file.cloudStorageObject = fileName;
            fileObj.makePublic().then(() => {
                file.cloudStoragePublicURL = getPublicURL(fileName);
                next();
            });
        });

        stream.end(file.buffer);
    });
}

function getPublicURL(fileName) {
    return `https://storage.googleapis.com/${BUCKET_NAME}/${FOLDER_NAME}/${fileName};`
}
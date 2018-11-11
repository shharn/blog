import multer from 'multer';
import Storage from '@google-cloud/storage';
import logger from './logger';

const PROJECT_ID = process.env.PROJECT_ID;
const BUCKET_NAME = process.env.BUCKET_NAME;

const storage = new Storage({
    projectId: PROJECT_ID
});
const bucket = storage.bucket(BUCKET_NAME)

export const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export function uploadeImage(req, res, next) {
    if (!req.file) {
        return next();
    }

    req.files.forEach(file => {
        const fileName = file.originalname;
        const fileObj = bucket.file(fileName);
        const stream = fileObj.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
            resumable: false
        });

        stream.on('error', err => {
            logger.error(`Error during streaming the file. Error : ${err.message}`);
            next(err);
        });

        stream.on('finish', () => {
            file.cloudStorageObject = fileName;
            fileObj.makePublic().then(() => {
                file.cloudStoragePublicURL = getPublicURL(fileName);
                next();
            });
        });
    });
}

function getPublicURL(fileName) {
    return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName};`
}
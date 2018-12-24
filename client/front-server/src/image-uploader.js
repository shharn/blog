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
    const uploads = req.files.map(file => {
        return new Promise((resolve, reject) => {
            const fileName = file.originalname;
            const fileObj = bucket.file(`${FOLDER_NAME}/${fileName}`);
            const stream = fileObj.createWriteStream({
                gzip: true,
                metadata: {
                    contentType: file.mimetype,
                    cacheControl: 'public, max-age=31536000'
                },
                resumable: false,
                predefinedAcl: 'publicRead'
            }).on('error', err => {
                reject({ err, fileName });
            }).on('finish', () => {
                fileObj.makePublic().then(() => {
                    file.cloudStoragePublicURL = getPublicURL(fileName);
                    resolve();
                });
            });
            stream.end(file.buffer);
        });
    });

    Promise.all(uploads)
        .then(() => next())
        .catch(({err, failedFileName }) => {
            logger.error(`[image-uploader] Failed to upload ${failedFileName} to GCP bucket : ${err.toString}`);
            req.failedFileName = failedFileName;
        });
}

function getPublicURL(fileName) {
    return `https://storage.googleapis.com/${BUCKET_NAME}/${FOLDER_NAME}/${fileName};`
}
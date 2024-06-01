import { Storage } from '@google-cloud/storage';
import express from 'express';
import multer from 'multer';
import path from 'path';

const photoUploadRouter = express.Router();

const storage = new Storage({
    keyFilename: path.join(process.cwd(), process.env.KEY_FILENAME),
});

const bucket = storage.bucket(process.env.USER_BUCKET_NAME);

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb
    },
});

photoUploadRouter.post('/', multerMid.single('file'), (req, res, next) => {
    console.log("k")

    console.log({ body: req.body })

    return;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
        next(err);
    });

    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).send({ fileName: req.file.originalname, fileUrl: publicUrl });
    });

    blobStream.end(req.file.buffer);
});

export default photoUploadRouter;

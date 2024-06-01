import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

dotenv.config();

const storage = new Storage({
  keyFilename: path.join(process.cwd(), process.env.KEY_FILENAME),
});

const bucket = storage.bucket(process.env.USER_BUCKET_NAME);

// const configureMulter = () => {
//   const multerStorage = multer.memoryStorage();

//   const upload = multer({
//     storage: multerStorage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
//   });

//   return upload;
// };

const configureMulter = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  });

  return upload;
};

const uploadFileToGCS = async (buffer, filename) => {
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream();

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(buffer);
  });
};

export { configureMulter, uploadFileToGCS };


/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import express from "express";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, folder: string) => void
  ) => {
    cb(null, './uploads/');
  },
  filename: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, new Date().toISOString());
  }
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, supportsMimeType: boolean) => void
) => {
  const mimeTypes = ['image/jpeg', 'image/png'];
  if (mimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const app = express();

app.get('/', (req, res) => {
  res.send(`Welcome to file-upload-demo-server!`);
});

const port = 3333;
app.listen(port, err => {
  if (err) {
    console.error(err);
  }
  console.log(`Listening at http://localhost:${port}`);
});

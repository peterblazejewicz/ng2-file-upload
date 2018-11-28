/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import express from 'express';
import { Request, Response } from 'express';
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
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, `${file.filename}${new Date().toISOString()}`);
  }
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, supportsMimeType: boolean) => void
) => {
  const mimeTypes = /image\/jpeg|image\/png/i;
  if (mimeTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    // or cb("Error .... ")
    cb(null, false);
  }
};

const app = express();
const upload = multer({
  storage,
  fileFilter
});

app.get('/api', (req: Request, res: Response) => {
  res.send(`Welcome to file-upload-demo-server!`);
});

app.post(
  '/api',
  upload.array('uploads[]', 12),
  (req: Request, res: Response) => {
    console.log('files', req.files);
    res.send(req.files);
    res.send(req.files);
  }
);

const port = 3333;
app.listen(port, err => {
  if (err) {
    console.error(err);
  }
  console.log(`Listening at http://localhost:${port}`);
});

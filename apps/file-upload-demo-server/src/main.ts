/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import * as express from 'express';
import * as multer from 'multer';

const DIR = 'uploads';
const upload = multer({ dest: `${DIR}/` });
const app = express();

app.use(function(req, res, next) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'http://valor-software.github.io'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(
  multer({
    dest: DIR

    // rename: function(fieldname, filename) {
    //   return filename + Date.now();
    // },
    // onFileUploadStart: function(file) {
    //   console.log(file.originalname + ' is starting ...');
    // },
    // onFileUploadComplete: function(file) {
    //   console.log(file.fieldname + ' uploaded to  ' + file.path);
    // }
  })
);

app.get('/api', function(req, res) {
  res.end('file catcher example');
});

app.post('/api', function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      return res.end(err.toString());
    }

    res.end('File is uploaded');
  });
});

const port = process.env.PORT || 3333;
app.listen(port, err => {
  if (err) {
    console.error(err);
  }
  console.log(`Listening at http://localhost:${port}`);
});

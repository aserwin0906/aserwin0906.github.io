require('dotenv').config();
const mongoose = require ('mongoose');
const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const bodyParser = require('body-parser');
const app = express();
const validator = require('validator');

app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      return err;
    }
};

const urlSchema = new mongoose.Schema({
  url: {type: String, required: true},
  id: {type: String, required: true}
});

const Url = mongoose.model('Url', urlSchema);

const urlSave = async (url,id) => {
    try {
      await connectDB();
      const newUrlId = new Url({
        url: url,
        id: id
      });
      const savedRecord = await newUrlId.save();
      return console.log(savedRecord);
    } catch (err) {
      return err;
    }
}

const urlFind = async (id) => {
    try {
      await connectDB();
      const foundRecord = await Url.find({id:id});
      return foundRecord;
    } catch (err) {
      return err;
    }
}

app.post('/api/shorturl', async (req, res) => {
  const urlCheck = validator.isURL(req.body.url, {
    protocols: ['http','https','ftp','sftp'],
    require_tld: false,
    require_protocol: true
  });
  if (urlCheck == false) {
    return res.json({error: 'invalid url'})
  } else {
    const url = req.body.url;
    const id = nanoid(10);
    try {
      await urlSave(url,id);
      return res.json({ original_url: req.body.url, short_url: id });
    } catch (err) {
      console.error(err);
      return res.json({ error: 'error saving short_url'});
    }
  }
});

app.get('/api/shorturl/:short_url', async (req,res) => {
  try {
    const foundRecord = await urlFind(req.params.short_url);
    return res.redirect(foundRecord[0].url);
  } catch (err) {
    return res.json({error: 'error redirecting'});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

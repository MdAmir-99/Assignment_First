const express = require('express');
const multer = require('multer');
const route = require('./route');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const port = process.env.PORT || 8080;

const app = express();

dotenv.config({
    path: './config.env'
})

app.use(express.json()); 
app.use(multer().any());
app.use(cors());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DB_CON, { useNewUrlParser: true})
.then( () => console.log("MongoDb is connected ✔ "))
.catch ( err => console.log(err) )

app.use('/', route);

app.listen(port, function () {
    console.log('Express app running on port 🎧 ' + (process.env.PORT))
});
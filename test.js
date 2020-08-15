// call all the required packages
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const app = express();
var fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));

var Test = require('./Data/Model/test');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database') }
);
mongoose.set('useCreateIndex', true);

const port = 4000;

const server = app.listen(port, function() {
    console.log('Listening on port ' + port);
});

// ROUTES
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/abc.html');

});

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.post('/uploadphoto', upload.single('myImage'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    var file1 = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    console.log(file1);
    var data = new Test({
        userName: req.body.userName,
    });
    data.finalImg = file1;
    console.log(data);
    data.save(function(error, doc) {
        if (!error)
            res.status(200).send({ "message": "problem added successfully" });
        else {
            console.log(error);
            res.status(422).send([error]);
        }
    });
});

app.get('/photos', (req, res) => {
    db.collection('post').find().toArray((err, result) => {

        const imgArray = result.map(element => element._id);
        console.log(imgArray);

        if (err) return console.log(err);
        res.send(imgArray);

    });
});

app.get('/photo/:id', (req, res) => {
    Test.findOne({ userName: req.params.id }, (err, result) => {
        console.log(result);

        if (err) return console.log(err);

        res.contentType('image/jpeg');
        res.send(result.finalImg.image);


    });
});
app.get('/photo1', (req, res) => {
    db.collection('post').findOne((err, result) => {

        if (err) return console.log(err);

        res.contentType('image/jpeg');
        res.send(result.image.buffer);
        console.log(result);

    });
});
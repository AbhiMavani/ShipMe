// call all the required packages
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))




//ROUTES WILL GO HERE
app.get('/', function(req, res) {
    res.json({ message: 'WELCOME' });
});

app.listen(4000, () => console.log('Server started on port 3000'));

// SET STORAGE
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/abc.html');

});
const MongoClient = require('mongodb').MongoClient
const myurl = 'mongodb://localhost:27017';

MongoClient.connect(myurl, (err, client) => {
    if (err) return console.log(err)
    db = client.db('mydb')
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
})

app.post('/uploadphoto', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    db.collection('quotes').insertOne(finalImg, (err, result) => {
        console.log(result)

        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')


    });
});

app.get('/photos', (req, res) => {
    db.collection('mycollection').find().toArray((err, result) => {

        const imgArray = result.map(element => element._id);
        console.log(imgArray);

        if (err) return console.log(err)
        res.send(imgArray)

    });
});

app.get('/photo/:id', (req, res) => {
    var filename = req.params.id;

    db.collection('mycollection').findOne({ '_id': ObjectId(filename) }, (err, result) => {

        if (err) return console.log(err)

        res.contentType('image/jpeg');
        res.send(result.image.buffer)


    });
});
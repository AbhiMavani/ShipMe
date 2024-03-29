var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var fs = require("fs");
var path = require("path");
var jwt = require('jsonwebtoken');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var compiler = require('./Data/Module/compilex');
var contestCompiler = require('./Data/Module/contestCompilex');
var multer = require('multer');
require('dotenv/config');

var option = { stats: true };
compiler.init(option);
var app = express();

var User = require('./Data/Model/user');
var Shipment = require('./Data/Model/shipment');
var Problem = require('./Data/Model/problem');
var Question = require('./Data/Model/question');
var Contest = require('./Data/Model/contest');
var Answer = require('./Data/Model/answer');
var Solutions = require('./Data/Model/solution');
var Ranking = require('./Data/Model/ranking');
var Like = require('./Data/Model/likes');
var Quotation = require('./Data/Model/quotation');
var Test = require('./Data/Model/test');
var LivePath = require('./Data/Model/livepath');
var Receipt = require('./Data/Model/receipt');
const { decode } = require('punycode');



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/codeworld', { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database') }
);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());
app.use(passport.initialize());
const port = process.env.PORT || 3000;

const server = app.listen(port, function() {
    console.log('Listening on port ' + port);
});


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('ACCESS_Control-Allow-Headers', '*');

    if ('OPTIONS' === req.method) {
        return res.sendStatus(200);
    }
    next();
});

app.use((err, req, res, next) => {
    if (err.name == 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});


//multer for upload image.
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });



passport.use(new localStrategy({ usernameField: 'user_name' },
    (username, password, done) => {
        User.findOne({ user_name: username },
            (err, user) => {
                if (err)
                    return done(err);
                // Unknown user
                else if (!user)
                    return done(null, false, { message: 'username is not registered' });
                // Wrong password
                else if (!user.verifyPassword(password))
                    return done(null, false, { message: 'Wrong password.' })
                        // Authentication succeeded
                else
                    return done(null, user);
            });
    }));


verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided' });
    } else {
        jwt.verify(token, "SECRET#123",
            (err, decoded) => {
                if (err) {
                    return res.status(500).send({ auth: false, message: 'Token authentication failed' });
                } else {
                    req._id = decoded._id;
                    next();
                }
            }
        )
    }
}

app.get('/userProfile', verifyJwtToken, function(req, res, next) {
    // Find Id after verify token
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else {
                return res.status(200).json({ status: true, user: user });
            }
        }
    );
});

//show another user profile in new tab
app.get('/profileById', function(req, res) {
    User.findOne({ user_name: req.headers.userid }, function(error, result) {
        if (!error) {
            return res.status(200).json({ status: true, user: result });
        } else {
            console.log("Error On Retriving...");
            return res.send(error);
        }
    });
});

// After verify code make user logged in by user_name
app.get('/makeLoggedIn', function(req, res) {
    User.findOne({ user_name: req.headers.userid }, function(error, user) {
        if (!error) {
            return res.status(200).json({ "token": user.generateJwt() });
        } else {
            console.log("Error On Retriving...");
            return res.send(error);
        }
    });
});

// Send email for forget password code.
app.post('/sendMail', function(req, res) {
    User.findOne({ user_name: req.body.user_name },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ShipMeSDP@gmail.com',
                        pass: 'ShipMe@123'
                    }
                });

                var mailOptions = {
                    from: 'ShipMeSDP@gmail.com',
                    to: user.email_id,
                    subject: 'Replacement login information at ShipMe for ' + req.body.user_name,
                    html: '<p>Hello ' + req.body.user_name + ',</p><br><p>A request to reset the password for your account has been made at ShipMe.</p><br><h1 align="center" style="color:blue">' + req.body.code + '</h1><br><p>Enter this code at your forget password page. After logging in, you will be redirected to new password page so you can change your password.</p><br><p>-Admin</p><p>ShipMe</p>'
                };

                transporter.sendMail(mailOptions, function(error, info) {});
                return res.status(200).send({});
            }
        }
    );

});

app.post('/authenticate', function(req, res) {
    var userdata = new User();
    var username1 = req.body.user_name;
    var password1 = req.body.password;
    // Check for user
    User.findOne({ user_name: username1 }, function(err, user) {
        if (err) return res.send(err);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User record not found.' });
        }
        //Account is Activated or not
        if (user.isActivated === "No") {
            return res.status(422).json({ message: 'Your Account is not Verified Please Verify..' });
        }
        // Check for password
        if (password1 == user.password) {
            return res.status(200).json({ "token": user.generateJwt() });
        } else {
            return res.status(404).json({ status: false, message: 'Password not match.' });
        }
    });
});

app.post('/registration', function(req, res) {
    // Find user
    User.findOne({ user_name: req.body.user_name }, function(err, user) {
        if (err) return res.send(err);
        // User already found
        if (user) {
            return res.status(422).send(['*Username is already taken']);
        } else {
            User.findOne({ email_id: req.body.email_id }, function(err, user) {
                if (err) return res.send(err);
                // Email ID already found
                if (user) {
                    return res.status(422).send(['*Email address is already register.']);
                } else {
                    // Now we can save user
                    if (req.body.userType == "Transporter") {
                        var userdata = new User({ 'user_name': req.body.user_name, 'first_name': req.body.first_name, 'last_name': req.body.last_name, 'email_id': req.body.email_id, 'mobile_no': req.body.mobile_no, 'gender': req.body.gender, 'birth_date': null, 'role': "user", 'city': null, 'state': null, 'password': password = req.body.password, 'userType': userType = req.body.userType, 'liscence': liscence = req.body.liscence, 'vehical_type': vehical_type = req.body.vehical_type, 'capacity': capicity = req.body.capacity, 'isActivated': activated = "No", });

                    } else {
                        var userdata = new User({ 'user_name': req.body.user_name, 'first_name': req.body.first_name, 'last_name': req.body.last_name, 'email_id': req.body.email_id, 'mobile_no': req.body.mobile_no, 'gender': req.body.gender, 'birth_date': null, 'role': "user", 'city': null, 'state': null, 'password': password = req.body.password, 'userType': userType = req.body.userType, 'address': address = req.body.address, 'isActivated': isActivated = "No", });
                    }
                    userdata.save((err, doc) => {
                        if (!err)
                            console.log();
                        //return res.status(200).json({ "token": userdata.generateJwt() });
                        else {
                            console.log('error');
                        }
                    });

                    const token = userdata.generateJwt();
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'ShipMeSDP@gmail.com',
                            pass: 'ShipMe@123'
                        }
                    });
                    var link = 'http://localhost:4200/activated?token=';
                    var mailOptions = {
                        from: 'ShipMeSDP@gmail.com',
                        to: 'abhimavani981@gmail.com',
                        subject: 'Account Activation Requried ' + req.body.user_name,
                        html: '<html><h4>Please verify your account by<a href="' + link + token + '"> click here</a>...</h4><br><p>Thank You..<br><p>-Admin</p><p>ShipMe</p></html>'
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error)
                            return res.status(400).json({ message: "Something Went Wrong " });
                    });
                    return res.status(200).send({});


                }
            });
        }
    });
});

//Activate Account through Email
app.get('/activateAccount', function(req, res) {
    const token = req.headers.token;
    if (token) {
        jwt.verify(token, "SECRET#123",
            (err, decoded) => {
                if (err || decoded == undefined) {
                    return res.status(500).send({ auth: false, message: 'Incorrect or Expired link.' });
                } else {
                    User.updateOne({ _id: decoded._id }, { $set: { isActivated: "Yes" } }, function(err) {
                        if (err) return res.send(err);
                        else return res.status(200).json({ status: true, message: 'Registration Done successfully.' });
                    });
                }
            }
        )

    } else {
        return res.json({ error: "Something Went Wrong in Email Verification!!" });
    }
});

app.post('/updatePersonalDetail', verifyJwtToken, function(req, res) {
    if (req.body.userType == "Transporter") {
        User.updateOne({ _id: req._id }, { $set: { first_name: req.body.first_name, last_name: req.body.last_name, gender: req.body.gender, birth_date: req.body.birth_date, liscence: req.body.liscence, capacity: req.body.capacity, vehical_type: req.body.vehical_type } }, function(err) {
            if (err) return res.send(err);
            else return res.status(200).json({ status: true, message: 'Profile updated successfully.' });
        });
    } else {
        User.updateOne({ _id: req._id }, { $set: { first_name: req.body.first_name, last_name: req.body.last_name, gender: req.body.gender, birth_date: req.body.birth_date, address: req.body.address } }, function(err) {
            if (err) return res.send(err);
            else return res.status(200).json({ status: true, message: 'Profile updated successfully.' });
        });
    }
});

app.post('/updateCommunicationDetail', verifyJwtToken, function(req, res) {
    User.updateOne({ _id: req._id }, { $set: { email_id: req.body.email_id, city: req.body.city, state: req.body.state, mobile_no: req.body.mobile_no } }, function(err) {
        if (err) return res.send(err);
        else return res.status(200).json({ status: true, message: 'Profile updated successfully.' });
    });
});

app.post('/updatePrivacyDetail', verifyJwtToken, function(req, res) {
    User.updateOne({ _id: req._id }, { $set: { password: req.body.newpassword } }, function(err) {
        if (err) return res.send(err);
        else return res.status(200).json({ status: true, message: 'Profile updated successfully.' });
    });
});

// for getting ranking list for one contest
app.post('/getRankList', function(req, res) {
    var Finalresult = [];
    var groupField = { rank: ' ', user_name: ' ', points: ' ' };

    function setGroupField() {
        var groupField1 = {};
        for (k in groupField) {
            groupField1[k] = '---';
        }
        return groupField1;
    }
    // Find contest for getting column for problemCode
    Contest.findOne({ contestCode: req.body.contestCode }, function(error, result) {
        if (result) {
            result.problems.forEach(i => {
                groupField[i] = ' ';
            })
        } else {
            return res.status(422).send(['No Contest available for ' + req.body.contestCode]);
        }
        // Find user took part in requested contest
        Ranking.find({ contestCode: req.body.contestCode }, function(error, result) {
            if (!error) {
                var i1 = 0;
                result.forEach(i => {
                    var groupField1 = setGroupField();
                    i['problems'].forEach(j => {
                        groupField1[j] = 100;
                    })
                    groupField1.user_name = i['user_name'];
                    groupField1.points = i['points'];
                    groupField1.rank = i1 + 1;
                    Finalresult.push(groupField1);
                    i1++;
                    if (i1 == result.length) {
                        return res.send(Finalresult);
                    }
                })
            } else {
                return res.send(error);
            }
        }).sort({ points: -1 });
    });
});

// Getting solution History for  logged user
app.get('/getSolutionHistory', verifyJwtToken, function(req, res, next) {
    // Find solutions after verify token
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else {
                Solutions.find({ user_name: user.user_name }, function(error, result) {
                    if (!error) {
                        return res.send(result);
                    } else {
                        return res.send(error);
                    }
                }).sort({ DateTime: -1 });
            }
        }
    );
});

// Getting solution History for any user for profile
app.get('/getSolutionHistoryById', function(req, res) {
    Solutions.find({ user_name: req.headers.userid }, function(error, result) {
        if (!error) {
            return res.send(result);
        } else {
            return res.send(error);
        }
    }).sort({ DateTime: -1 });
})




// ##################################################################################



// show all question on discuss page
app.get('/questions', function(req, res) {
    Question.find({}, function(error, result) {
        if (!error) {
            return res.send(result);
        } else {
            return res.send(error);
        }
    });
});







// load likes
app.get('/loadlikes', function(req, res) {
    Like.find({ userId: req.headers.userid, questionId: req.headers.questionid }, function(error, result) {
        if (!error) {
            return res.send(result);
        } else {
            return res.send(error);
        }
    });
});







//show all anser for one question
app.get('/answers', function(req, res) {
    Answer.find({ questionId: req.headers.questionid }, function(error1, result) {
        if (result == null) {
            res.send(error1);
        } else {
            Question.findOne({ _id: req.headers.questionid }, function(error2, que) {
                if (que == null) {
                    return;
                } else {
                    Question.updateOne({ _id: req.headers.questionid }, { $set: { viewCount: ++que.viewCount } }, function(error3, upque) {
                        if (error3) {
                            res.send(error3);
                        }
                    });
                }
            });
            return res.send(result);
        }
    });
});






//show question in new tab
app.get('/questionbyid', function(req, res) {
    Question.find({ _id: req.headers.questionid }, function(error, result) {
        if (!error) {
            return res.send(result);
        } else {
            return res.send(error);
        }
    });
});






//post new question
app.post('/question', function(req, res) {
    let data = new Question({
        userId: req.body.userId,
        question: req.body.question,
        timeStamp: Date.now(),
        viewCount: 0,
        ansCount: 0
    });
    data.save(function(error, doc) {
        if (!error)
            res.status(200).send({ "message": "problem added successfully" });
        else {
            res.status(422).send(['Add Question Failed']);
        }
    });
});






//post answer for question
app.post('/answer', function(req, res) {
    let data = new Answer({
        userId: req.body.userId,
        questionId: req.body.questionId,
        answer: req.body.answer,
        timeStamp: Date.now(),
        likeCount: 0,
        dislikeCount: 0
    });
    data.save(function(error, doc) {
        if (!error) {
            Question.findOne({ _id: req.body.questionId }, function(error, que) {
                Question.updateOne({ _id: req.body.questionId }, { $set: { ansCount: ++que.ansCount } }, function(error, upque) {});
            });
            res.status(200).send({ "message": "answer added successfully" });
        } else {
            res.status(422).send(['Post Answer Failed']);
        }
    });
});






//give like
app.post('/like', function(req, res) {
    let data = new Like({
        userId: req.body.userId,
        answerId: req.body.answerid,
        questionId: req.body.questionId,
        like: 1,
        dislike: 0
    });
    data.save(function(error1, doc) {
        if (!error1) {
            Answer.findOne({ _id: req.body.answerid }, function(error2, ans) {
                if (!error2) {
                    Answer.updateOne({ _id: req.body.answerid }, { $set: { likeCount: ++ans.likeCount } }, function(error3, upque) {
                        if (error3) {
                            res.status(422).send(['Something went wrong.']);
                        };
                    });
                } else {
                    res.status(422).send(['No Record Found.']);
                }
                res.status(200).send({ "message": "liked" });
            });
        } else {
            res.status(422).send(['Failed']);
        }
    });
});






//give dislike
app.post('/dislike', function(req, res) {
    let data = new Like({
        userId: req.body.userId,
        answerId: req.body.answerid,
        questionId: req.body.questionId,
        like: 0,
        dislike: 1
    });
    data.save(function(error1, doc) {
        if (!error1) {
            Answer.findOne({ _id: req.body.answerid }, function(error2, ans) {
                if (!error2) {
                    Answer.updateOne({ _id: req.body.answerid }, { $set: { dislikeCount: ++ans.dislikeCount } }, function(error3, upque) {
                        if (error3) {
                            res.status(422).send(['Something went wrong.']);
                        };
                    });
                } else {
                    res.status(422).send(['No Record Found.']);
                }
                res.status(200).send({ "message": "disliked" });
            });
        } else {
            res.status(422).send(['Failed']);
        }
    });
});





// admin delete answer
app.delete('/deleteanswer', function(req, res) {
    Like.deleteMany({ answerId: req.headers.answerid }, function(error2, upque) {
        if (error2) {
            res.status(422).send(['Something went wrong.']);
        }
    });
    try {
        Answer.findOne({ _id: req.headers.answerid }, function(error1, ans) {
            if (ans == null) {
                res.status(422).send(['Record Not Found.']);
            } else {
                Answer.deleteOne({ _id: req.headers.answerid }, function(error2, upque) {
                    if (error2) {
                        res.status(422).send(['Something went wrong.']);
                    } else {
                        Question.findOne({ _id: req.headers.questionid }, function(error3, que) {
                            if (que == null) {
                                res.status(422).send(['Record Not Found.']);
                            } else {
                                Question.updateOne({ _id: req.headers.questionid }, { $set: { ansCount: --que.ansCount } }, function(error4, upque) {
                                    if (error4) {
                                        res.status(422).send(['Something went wrong.']);
                                    } else {
                                        res.status(200).send({ "message": "Deleted" });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        res.status(422).send(['Something went wrong.']);
    }
});


// admin delete questio
app.delete('/deletequestion', function(req, res) {

    Answer.deleteMany({ questionId: req.headers.questionid }, function(error1, upque) {
        if (error1) {
            res.status(422).send(['Something went wrong.']);
        } else {
            Like.deleteMany({ questionId: req.headers.questionid }, function(error2, upque) {
                if (error2) {
                    res.status(422).send(['Something went wrong.']);
                }
            });
        }
    });

    Question.deleteOne({ _id: req.headers.questionid }, function(err, upque) {
        if (err) {
            res.status(422).send(['Something went wrong.']);
        }
        res.status(200).send({ "message": "Deleted" });
    });
});


// show question ask by particular user
app.post('/my-questions', function(req, res) {
    Question.find({ userId: req.body.user_name }, function(error, result) {
        if (!error) {
            return res.send(result);
        } else {
            console.log("Error On Retriving...");
            return res.send(error);
        }
    });
});



// show answer given by particular user
app.post('/my-answers', function(req, res) {
    var Finalresult = [];
    var temp = [];
    Answer.find({ userId: req.body.user_name }, function(error, result) {
        if (!error) {
            var ii = 0;
            result.forEach(i => {
                Question.findOne({ _id: i['questionId'] }, function(error, result1) {
                    if (!error) {
                        Finalresult.push(result1);
                        ii++;
                        if (ii == result.length) {
                            return res.send(Finalresult);
                        }
                    }
                });
            });
        } else {
            console.log("Error On Retriving...");
            return res.send(error);
        }
    });
});





// #################################################################################



app.post('/addproblem', function(req, res) {

    let data = new Problem({
        problemCode: req.body.problemCode.toUpperCase(),
        problemName: req.body.problemName,
        problemType: req.body.problemType,
        problemStatus: req.body.problemStatus,
        timeLimit: req.body.timeLimit,
        No_of_testcase: req.body.No_of_testcase,
        successfull: 0,
        total: 0,
    });
    console.log(data);
    Problem.findOne({ 'problemCode': req.body.problemCode }, function(error, status) {
        if (status) {
            res.status(422).send(['problem code is already taken']);
        } else {
            var dirpath = path.join(__dirname, 'Data', 'Problems', '/');

            fs.mkdir(path.join(__dirname, 'Data', 'Contests', 'PRACTICE', '/') + req.body.problemCode, function(err) {});
            fs.mkdir(dirpath + req.body.problemCode, function(err) {
                this.dirpath = path.join(dirpath, req.body.problemCode, '/');
                if (err) {
                    // directory alredy exist;
                }
                fs.writeFile(this.dirpath + 'Defination.txt', req.body.Defination, function(err) {
                    if (err) {
                        // problem in file creations
                    };
                });

                var x = req.body.Testcase.split('#############################################');
                var i, filename = [],
                    output = [];
                for (i = 1; i < x.length; i++) {
                    filename[i - 1] = "Testcase" + i + ".txt";
                    output[i - 1] = "Output" + i + ".txt";
                }
                for (i = 0; i < x.length - 1; i++) {
                    var content = x[i].split("###############");
                    console.log(content[0] + " " + content[1]);
                    if (content[0] == undefined | content[1] == undefined) {
                        res.status(422).send(['Testcase in not prepare in desire input and output formate']);
                        return;
                    }

                    fs.writeFile(this.dirpath + filename[i], content[0].trim(), function(err) {
                        if (err) {
                            console.log(i);
                        };
                    });
                    fs.writeFile(this.dirpath + output[i], content[1].trim(), function(err) {
                        if (err) {
                            console.log(i);
                        };
                    });
                }

                data.save(function(error, doc) {
                    if (!error)
                        res.status(200).send({ "message": "problem added successfully" });
                    else {
                        console.log(error);
                        res.status(422).send([error]);
                    }
                });

            });
        }

    });

});


app.post('/addshipment', upload.single('file'), function(req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    var file1 = {
        contentType: req.file.mimetype,
        image: new Buffer.from(encode_image, 'base64')
    };
    var obj = new Shipment({
        user_name: req.body.user_name,
        shipmentName: req.body.shipmentName,
        shipmentCode: req.body.shipmentCode,
        shipmentType: req.body.shipmentType,
        budget: req.body.budget,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        fromCollection: req.body.fromCollection,
        toDelivery: req.body.toDelivery,
        shipmentStatus: req.body.shipmentStatus,
    });
    obj.shipmentImage = file1;

    obj.save(function(error, doc) {
        if (!error)
            res.status(200).send({ "message": "Shipment added successfully" });
        else {
            console.log(error);
            res.status(422).send([error]);
        }
    });
});


//Upload Acknowledge Receipt
app.post('/uploadReceipt', upload.single('file'), function(req, res) {
    var pdfFile = fs.readFileSync(req.file.path);
    var encode_pdf = pdfFile.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    var file1 = {
        contentType: req.file.mimetype,
        receiptPDF: new Buffer.from(encode_pdf, 'base64')
    };
    var obj = new Receipt({
        user_name: req.body.user_name,
        shipmentCode: req.body.shipmentCode,
    });
    obj.ackReceipt = file1;

    obj.save(function(error, doc) {
        if (!error)
            res.status(200).send({ message: "Acknowledge Receipt Uploaded successfully" });
        else {
            console.log(error);
            res.status(422).send([error]);
        }
    });
});

app.get('/problems', function(req, res) {
    Problem.find({}, function(error, data) {
        //console.log(contestData);
        if (!error) {
            return res.send(data);
        } else {
            console.log("oh my god");
            return res.send(error);
        }

    });
});

/// To get all Shipments
app.get('/shipments', function(req, res) {
    Shipment.find({ shipmentStatus: "pending" }, function(error, data) {
        if (!error) {
            return res.send(data);
        } else {
            console.log("oh my god");
            return res.send(error);
        }

    }).sort({ startDate: -1 });
});

/// To get Shipment By Customer ID
app.get('/getShipmentById', function(req, res) {
    Shipment.find({ user_name: req.headers.userid }, function(error, result) {
        if (!error) {
            return res.send(result);
        } else {
            return res.send(error);
        }
    }).sort({ startDate: -1 });
});

//shipment by code
app.get('/shipments/:shipmentCode', function(req, res) {

    Shipment.findOne({ shipmentCode: req.params.shipmentCode }, function(error, data) {
        if (!error) {
            return res.send(data);
        }
        console.log("Oh my God");
        return res.send(error);
    });
});

app.get('/getReceiptbyCode/:shipmentCode', function(req, res) {

    Receipt.findOne({ shipmentCode: req.params.shipmentCode }, function(error, data) {
        if (!error) {
            return res.send(data);
        }
        console.log("Oh my God");
        return res.send(error);
    });
});




/* Transporter#########################################################*/



app.get('/getDrivers', function(req, res) {

    User.findOne({ user_name: req.query.user_name }, function(error, data) {
        if (!error) {
            return res.send(data.drivers);
        }
        console.log("error in /getDrivers");
        return res.send(error);
    });
});

app.put('/addDrivers', function(req, res) {

    flag = true;
    User.findOne({ user_name: req.body.user_name }, function(err, user) {

        user.drivers.forEach(element => {
            if (element.liscence == req.body.liscence) {
                flag = false;
                return res.status(422).send(["Driver with this liscence already exist with name : " + element.name]);
            }
        });

        if (flag) {
            User.findOneAndUpdate({ user_name: req.body.user_name }, { $push: { drivers: { "name": req.body.name, "liscence": req.body.liscence, "phoneNo": req.body.phoneNo } } }, { new: true }, function(error, doc) {

                if (error) { console.log("error in /addDrivers :: " + error); return res.status(422).send(error); } else return res.status(200).send(doc.drivers);

            });
        }
    });
});

app.delete('/deleteDriver', function(req, res) {

    User.updateOne({ user_name: req.query.user_name }, { $pull: { "drivers": { liscence: req.query.liscence } } }, function(err, status) {
        if (err) {
            return res.status(422).send([err])
        }
    });

    return res.status(200).send(["request successfully"]);
});



app.get('/quotation/:shipmentCode', function(req, res) {

    Quotation.find({ shipmentCode: req.params.shipmentCode }, function(error, data) {
        if (!error) {
            return res.send(data);
        }
        console.log("Oh my God");
        return res.send(error);
    }).sort({ amount: 1 });
});



app.get('/transporterQuotation/:transporterId', function(req, res) {

    Quotation.find({ transporterId: req.params.transporterId, status: { $ne: "completed" } }, function(error, data) {
        if (!error) {
            return res.send(data);
        }
        console.log("my god");
        con
        return res.send(error);
    });
});


app.post('/quotation', function(req, res) {
    Quotation.countDocuments({ transporterId: req.body.transporterId, shipmentCode: req.body.shipmentCode }, function(err, count) {
        if (count) {
            return res.status(409).send(['Quotation alread exist']);
        } else {

            let data = new Quotation({
                shipmentCode: req.body.shipmentCode,
                transporterId: req.body.transporterId,
                amount: req.body.amount,
                services: req.body.services,
                comment: req.body.comment,
                status: req.body.status
            });

            data.save(function(error, doc) {
                if (!error)
                    res.status(200).send({ "message": "Quotation added successfully" + req.body.shipmentCode });
                else {
                    res.status(422).send(['adding quotation failed']);
                }
            });

        }

    });
});

app.delete('/deleteQuotation', function(req, res) {

    Quotation.deleteOne({ transporterId: req.query.transporterId, shipmentCode: req.query.shipmentCode }, function(error, upque) {
        if (error) {
            console.log("Error in deleting the quotation : " + error);
            res.status(422).send(['Something went wrong.']);
        }
        return res.status(200).send({ "message": "Deleted" });
    });
});

app.delete('/deleteShipment', function(req, res) {

    Shipment.deleteOne({ shipmentCode: req.query.shipmentCode }, function(error, upque) {
        if (error) {
            console.log("Error in deleting the Shipment: " + error);
            res.status(422).send(['Something went wrong.']);
        }
        return res.status(200).send({ "message": "Deleted" });
    });
});

app.put('/acceptQuotation', function(req, res) {
    Quotation.countDocuments({ shipmentCode: req.body.shipmentCode, status: "accepted" }, function(err, count) {
        if (count > 0) {
            return res.status(409).send(['You have already accepted the quotation']);
        }

        let data = {
            status: "accepted"
        };

        var query = { 'transporterId': req.body.transporterId, 'shipmentCode': req.body.shipmentCode };

        Quotation.updateOne(query, data, function(err, doc) {
            if (err) { console.log(err); return res.status(500).send(['Quotation Accepting failed']); }
        });

        Shipment.updateOne({ 'shipmentCode': req.body.shipmentCode }, { shipmentStatus: "accepted" }, function(err, doc) {
            if (err) { console.log(err); return res.status(500).send(['Quotation Accepting failed']); }
        });

        return res.status(200).send({ "message": "Quotation Accepted" });

    });

});

app.put('/completeShipment', function(req, res) {

    var user_name;
    let data = {
        status: "completed"
    };

    var query = { 'transporterId': req.body.transporterId, 'shipmentCode': req.body.shipmentCode };

    Quotation.updateOne(query, data, function(err, doc) {
        if (err) { console.log(err); return res.status(500).send(['Quotation Accepting failed']); }
    });

    Shipment.updateOne({ 'shipmentCode': req.body.shipmentCode }, { shipmentStatus: "completed" }, function(err, doc) {
        if (err) { console.log(err); return res.status(500).send(['Quotation Accepting failed']); }
    });

    Shipment.findOne({ 'shipmentCode': req.body.shipmentCode }, function(err, doc) {
        if (err) { console.log(err); return res.status(500).send(['Quotation Accepting failed']); }
        user_name = doc.user_name;

        User.findOne({ user_name: doc.user_name },
            (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                }
                if (!user)
                    return res.status(404).json({ status: false, message: 'User record not found.' });
                else {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'ShipMeSDP@gmail.com',
                            pass: 'ShipMe@123'
                        }
                    });

                    var mailOptions = {
                        from: 'ShipMeSDP@gmail.com',
                        to: 'abhimavani981@gmail.com',
                        subject: 'Your Shipment is Delivered: ' + req.body.transporterId,
                        html: '<p>Hello ' + doc.user_name + ',</p><br><p>Your shipment <b>' + req.body.shipmentCode + '</b> have been delivered by transporter by <b>' + req.body.transporterId + '</b> .</p><br><p>Thankyou for using Shipment</p><p>-Admin</p>'
                    };


                    transporter.sendMail(mailOptions, function(error, info) {

                    });
                }
            }
        );
    });
    return res.status(200).send({ "message": "Quotation Accepted" });


});


app.put("/quotation", function(req, res) {
    let data = {
        shipmentCode: req.body.shipmentCode,
        transporterId: req.body.transporterId,
        amount: req.body.amount,
        services: req.body.services,
        comment: req.body.comment,
        status: req.body.status
    };

    var query = { 'transporterId': req.body.transporterId, 'shipmentCode': req.body.shipmentCode };


    Quotation.updateOne(query, data, function(err, doc) {
        if (err) { console.log(err); return res.status(500).send(['editing quotation failed']); }
        return res.status(200).send({ "message": "Quotation edited successfully" + req.body.shipmentCode });
    });

});


app.get('/completedShipment', function(req, res) {

    var query = { transporterId: req.query.transporterId, status: "completed" }

    Quotation.find(query, function(error, data) {
        if (!error) {
            return res.send(data);
        }
        console.log("Oh my God");
        return res.send(error);
    });
});


app.put('/shipment', function(req, res) {
    let data = {
        shipmentName: req.body.shipmentName,
        shipmentCode: req.body.shipmentCode,
        shipmentType: req.body.shipmentType,
        budget: req.body.budget,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        fromCollection: req.body.fromCollection,
        toDelivery: req.body.toDelivery,
    };

    var query = { 'shipmentCode': req.body.shipmentCode };

    Shipment.updateOne(query, data, function(err, doc) {
        if (err) { console.log(err); return res.status(500).send(['editing shipment failed']); }
        return res.status(200).send({ "message": "Shipment edited successfully" + req.body.shipmentCode });
    });

});




app.get('/quotationForEdit', function(req, res) {
    Quotation.findOne({ transporterId: req.query.transporterId, shipmentCode: req.query.shipmentCode }, function(error, data) {
        if (!error) {
            return res.send(data);

        } else {
            console.log("oh my god");
            return res.send(error);
        }
    });
});

app.get('/shipmentForEdit', function(req, res) {

    Shipment.findOne({ shipmentCode: req.query.shipmentCode }, function(error, data) {
        if (!error) {
            return res.send(data);

        } else {
            console.log("oh my god");
            return res.send(error);
        }
    });
});


app.get('/quotation', function(req, res) {
    Quotation.find({}, function(error, data) {
        if (!error) {
            return res.send(data);
        } else {
            console.log("oh my god");
            return res.send(error);
        }
    });
});

app.put("/finishQuotation", function(req, res) {
    let data = {
        status: "completed"
    };

    var query = { 'transporterId': req.body.transporterId, 'shipmentCode': req.body.shipmentCode };

    Quotation.updateOne(query, data, function(err, doc) {
        if (err) { console.log(err); return res.status(500).send(['editing quotation failed']); }
        return res.status(200).send({ "message": "Quotation edited successfully" + req.body.shipmentCode });
    });

});



app.post('/sendNotification', function(req, res) {

    User.findOne({ user_name: req.body.transporterId },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'ShipMeSDP@gmail.com',
                        pass: 'ShipMe@123'
                    }
                });
                var link = 'http://localhost:4200/transporter/shipment/view-quotation';
                var mailOptions = {
                    from: 'ShipMeSDP@gmail.com',
                    to: 'abhimavani981@gmail.com',
                    subject: 'Your quotation is accepted ' + req.body.transporterId,
                    html: '<p>Hello ' + req.body.transporterId + ',</p><br><p>Your quotation for shipment  <b>' + req.body.shipmentCode + '</b> have been accepted. You can view it on manage <a href="' + link + '"> shipment panel </a> of the Shipme Dashboard.</p><br><p>Thankyou for using Shipment</p><p>-Admin</p>'
                };

                transporter.sendMail(mailOptions, function(error, info) {});
                return res.status(200).send({});
            }
        }
    );

});

app.get('/location', function(req, res) {

    var filter = {
        user_name: req.query.transporterId,
        shipmentCode: req.query.shipmentCode
    }
    LivePath.findOne(filter, function(error, data) {
        if (!error) {
            return res.send(data);
        } else {
            console.log("oh my god");
            return res.send(error);
        }
    });
});


app.post('/location', function(req, res) {

    var filter = {
        user_name: req.body.transporterId,
        shipmentCode: req.body.shipmentCode
    }
    var update = {
        lat: req.body.lat,
        lng: req.body.lng
    }

    LivePath.findOneAndUpdate(filter, update, { new: true, upsert: true }, function(error, doc) {
        if (error) {
            res.status(422).send([error]);
        } else {
            res.status(200).send({ "message": "Location Updated Successfull" });
        }
    });



});





app.get('/problem', function(req, res) {
    testcase = '';
    defination = '';
    code = req.query.problemCode;
    Problem.findOne(req.query, function(error, data) {
        if (!error) {
            var dirpath = path.join(__dirname, 'Data', 'Problems', '/', code, '/');
            defination = fs.readFileSync(dirpath + 'Defination.txt').toString();

            var i, filename = [];
            for (i = 0; i < data.No_of_testcase; i++) {
                filename[i] = "Testcase" + (i + 1) + ".txt";
            }
            for (i = 0; i < data.No_of_testcase; i++) {
                testcase += fs.readFileSync(dirpath + filename[i]).toString().concat('#############################################');
            }

            var response = {
                problemCode: data.problemCode,
                problemName: data.problemName,
                problemType: data.problemType,
                Defination: this.defination,
                No_of_testcase: data.No_of_testcase,
                Testcase: this.testcase
            };

            return res.send(response);
        } else {
            console.log("oh my god");
            return res.send(error);
        }
    });
});


// methods of contests //

app.post('/createContest', function(req, res) {
    let data = new Contest({
        contestCode: req.body.contestCode,
        contestName: req.body.contestName,
        contestStatus: req.body.contestStatus,
        problems: req.body.problems,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,

    });
    Contest.findOne({ 'contestCode': req.body.contestCode }, function(error, status) {
        if (status) {
            res.status(422).send(['problem code is already taken']);
        } else {
            data.save(function(error, doc) {
                if (!error) {
                    var dirpath = path.join(__dirname, 'Data', '/Contests/', data.contestCode);

                    fs.mkdir(dirpath, function(err) {
                        dirpath = path.join(__dirname, 'Data', '/Contests/', data.contestCode, '/');
                        data.problems.forEach(pcode => {
                            fs.mkdir(dirpath + pcode, function(err) {
                                contestDir = path.join(__dirname, 'Data', '/Contests/', data.contestCode, '/', pcode, '/Testcase1.txt');
                                problemDir = path.join(__dirname, 'Data', '/Problems/', pcode, '/Testcase1.txt');
                                fs.copyFile(problemDir, contestDir, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            });
                        });
                    });


                    res.status(200).send({ "message": "contest created successfully" });
                } else {
                    console.log(error);
                    res.status(422).send([error]);
                }
            });
        }
    });
});

app.get('/getContests', function(req, res) {
    Contest.find({}, function(error, status) {
        if (!error) {
            res.send(status);
        } else {
            res.send(error);
        }
    });
});

app.get('/getContest', function(req, res) {
    Contest.find(req.query, function(error, status) {
        if (status[0] === undefined || error) {
            res.status(422).send(['Contest Not Found']);
        } else {
            res.send(status);
        }
    });
});
app.post('/findAllProblems', function(req, res) {
    console.log(req.body);

    Problem.find({ problemCode: { $in: req.body } }, function(error, status) {
        if (status[0] === undefined || error) {
            console.log('Problem Not Found');
            res.status(422).send(['Problem Not Found']);
        } else {
            res.send(status);
        }
    });
});

app.post('/getFile', function(req, res) {

    Solutions.find(req.body, function(error, status) {
        if (status[0] === undefined || error) {
            console.log(error);
            // res.status(422).send(['Problem Not Found']);
        } else {
            var file = fs.readFileSync(status[0].location).toString();
            var response = {
                file: file,
                lang: status[0].language
            };
            res.send(response);

            // res.send(status);
        }
    });
});


app.post('/updateContest', function(req, res) {
    if (req.body.contestStatus === 'End') {
        Contest.find({ contestCode: req.body.contestCode }, function(error, status) {

            status[0].problems.forEach(element => {
                Problem.updateOne({ problemCode: element }, { problemStatus: true }, function(err, ress) {});

            });

        });
        var myquery = { contestCode: req.body.contestCode };
    } else {
        var myquery = { contestCode: req.body.contestCode };
    }
    var newvalues = { $set: { contestStatus: req.body.contestStatus } };
    Contest.updateOne(myquery, newvalues, function(err, ress) {
        if (err)
            console.log(err);
        else {
            res.status(200).send({ "message": "contest Update successfully" });
        }
    });
});

app.post('/compilecode', function(req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    if (req.body.input) {
        inputRadio = true;
    } else {
        inputRadio = false;
    }

    if ((lang === "C") || (lang === "C++")) {
        if (inputRadio) {
            var envData = { options: { timeout: 5000, killSignal: 'SIGINT' } };
            compiler.compileCPPWithInput(envData, code, input, function(data) {
                res.status(200).send(data);
            });
        } else {
            var envData = { options: { timeout: 5000, killSignal: 'SIGINT' } };
            compiler.compileCPP(envData, code, function(data) {
                res.status(200).send(data);
            });
        }
    }
    if (lang === "Java") {
        if (inputRadio) {
            var envData = { options: { timeout: 5000, killSignal: 'SIGINT' } };
            compiler.compileJavaWithInput(envData, code, input, function(data) {
                res.status(200).send(data);
            });
        } else {
            var envData = { options: { timeout: 5000, killSignal: 'SIGINT' } };
            compiler.compileJava(envData, code, function(data) {
                if (data) {
                    res.status(200).send(data);
                }
            });

        }

    }
    if (lang === "Python") {
        if (inputRadio) {
            var envData = { options: { timeout: 5000, killSignal: 'SIGINT' } };
            compiler.compilePythonWithInput(envData, code, input, function(data) {
                res.status(200).send(data);
            });
        } else {
            var envData = { options: { timeout: 5000, killSignal: 'SIGINT' } };
            compiler.compilePython(envData, code, function(data) {
                res.status(200).send(data);
            });
        }
    }
});


app.post('/submitsolution', function(req, res) {
    var code = req.body.code;
    var lang = req.body.lang;
    var pcode = req.body.pcode;
    var ccode = req.body.ccode;
    var username = req.body.username;
    var problems = [];
    var timeLimit;
    var successfull;
    var total;
    var location;
    var response;
    var buttonStatus = false;

    Problem.find({ problemCode: pcode }, function(error, status) {
        if (status[0] === undefined || error) {
            console.log('Problem Not Found');
            res.status(422).send(['Problem Not Found']);
        } else {


            successfull = status[0].successfull;
            timeLimit = status[0].timeLimit;
            total = status[0].total;
            Ranking.findOne({ contestCode: ccode, user_name: username }, function(error, status) {
                if (!error && status != null) {
                    problems = status.problems;
                }
                if (status == null) {
                    let newranking = new Ranking({
                        user_name: username,
                        contestCode: ccode,
                        points: 0,
                        problems: [],
                        rank: 0,
                        rating: 0,
                    });
                    newranking.save((err, data) => {
                        if (err)
                            console.log(err)
                    });
                }

            });
            var dirpath = path.join(__dirname, 'Data', 'Problems', '/', pcode, '/');
            var output = fs.readFileSync(dirpath + 'Output1.txt').toString();
            if ((lang === "C") || (lang === "C++")) {
                var envData = { options: { timeout: timeLimit, killSignal: 'SIGINT' }, pcode: pcode, ccode: ccode };
                contestCompiler.compileCPPWithInput(envData, code, function(data) {
                    location = data.location;

                    if (data.error) {
                        response = { status: data.error };
                        res.status(200).send(response);
                    } else {

                        if (data.output.trim() == output) {
                            response = { status: 'AC' };
                            res.status(200).send(response);
                        } else {
                            response = { status: 'WA' };
                            res.status(200).send(response);
                        }

                    }
                    let solution = new Solutions({
                        user_name: username,
                        DateTime: new Date(),
                        contestCode: ccode,
                        problemCode: pcode,
                        status: response.status,
                        language: lang,
                        location: location
                    });
                    solution.save((error, doc) => { if (error) console.log(error) });
                    if (response.status == 'AC' && !problems.includes(pcode)) {
                        problems.push(pcode);
                        let ranking = {
                            user_name: username,
                            contestCode: ccode,
                            points: problems.length * 100,
                            problems: problems,
                            rank: 0,
                            rating: 0,
                        }
                        if (ccode != 'PRACTICE')
                            Ranking.updateOne(({ contestCode: ccode, user_name: username }), { $set: ranking }, (err) => { if (err) console.log(err) });
                    }
                    updateProblemData(response.status, successfull, total, pcode);

                });
            }
            if (lang === "Java") {

                var envData = { options: { timeout: timeLimit, killSignal: 'SIGINT' }, pcode: pcode, ccode: ccode };
                contestCompiler.compileJavaWithInput(envData, code, function(data) {
                    location = data.location;
                    if (data.error) {
                        response = { status: data.error };
                        res.status(200).send(response);
                    } else {

                        if (data.output.trim() == output) {
                            response = { status: 'AC' };
                            res.status(200).send(response);
                        } else {
                            response = { status: 'WA' };
                            res.status(200).send(response);
                        }

                    }
                    let solution = new Solutions({
                        user_name: username,
                        DateTime: new Date(),
                        contestCode: ccode,
                        problemCode: pcode,
                        status: response.status,
                        language: lang,
                        location: location
                    });
                    solution.save((error, doc) => { if (error) console.log(error) });
                    if (response.status == 'AC' && !problems.includes(pcode)) {
                        problems.push(pcode);
                        let ranking = {
                            user_name: username,
                            contestCode: ccode,
                            points: problems.length * 100,
                            problems: problems,
                            rank: 0,
                            rating: 0,
                        }
                        if (ccode != 'PRACTICE')
                            Ranking.updateOne(({ contestCode: ccode, user_name: username }), { $set: ranking }, (err) => { if (err) console.log(err) });
                    }
                    updateProblemData(response.status, successfull, total, pcode);

                });

            }
            if (lang === "Python") {
                var envData = { options: { timeout: timeLimit, killSignal: 'SIGINT' }, pcode: pcode, ccode: ccode };
                contestCompiler.compilePythonWithInput(envData, code, function(data) {
                    location = data.location;
                    if (data.error) {
                        response = { status: data.error };
                        res.status(200).send(response);
                    } else {

                        if (data.output.trim() == output) {
                            response = { status: 'AC' };
                            res.status(200).send(response);
                        } else {
                            response = { status: 'WA' };
                            res.status(200).send(response);
                        }

                    }
                    let solution = new Solutions({
                        user_name: username,
                        DateTime: new Date(),
                        contestCode: ccode,
                        problemCode: pcode,
                        status: response.status,
                        language: lang,
                        location: location
                    });
                    solution.save((error, doc) => { if (error) console.log(error) });
                    if (response.status == 'AC' && !problems.includes(pcode)) {
                        problems.push(pcode);
                        let ranking = {
                            user_name: username,
                            contestCode: ccode,
                            points: problems.length * 100,
                            problems: problems,
                            rank: 0,
                            rating: 0,
                        }
                        if (ccode != 'PRACTICE')
                            Ranking.updateOne(({ contestCode: ccode, user_name: username }), { $set: ranking }, (err) => { if (err) console.log(err) });
                    }

                    updateProblemData(response.status, successfull, total, pcode);

                });
            }
        }
    });
});

function updateProblemData(status, successfull, total, pcode) {
    var x;
    if (status == 'AC') {
        x = {
            successfull: successfull + 1,
            total: total + 1
        }
        console.log(x);
    } else {
        x = {
            total: total + 1
        }
    }
    Problem.updateOne(({ problemCode: pcode }), { $set: x }, (err) => { if (err) console.log(err) });
}
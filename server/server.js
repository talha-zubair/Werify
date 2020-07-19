const socket = require("socket.io");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
require("./db/db.js");

const recipientRoutes = require("./routes/recipient");
const organizationRoutes = require("./routes/organization");
const adminRoutes = require("./routes/admin");
const mailRoutes = require("./routes/nodemailer.js");
const path = require("path");

const ChatModel = require("./models/chat.js");

const jwt = require("jsonwebtoken");
var jwtfile = require("./jwt/jwt.js");

app.use(bodyparser.json());
app.use(cors())

app.use('/assets', express.static('assets'));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/email", mailRoutes.routes);
app.use("/recipient", recipientRoutes.routes);
app.use("/organization", organizationRoutes.routes);
app.use("/admin", adminRoutes.routes);

app.get('/', function (req, res) {
      res.send('Hello');
});

require('dotenv').config();
const port = process.env.PORT || 3000;


server = app.listen(port, () => {
      console.log("Running Server at " + port);
});


var io = socket(server);
io.on('connection', (socket) => {
      socket.on('mes_from_rec', (data) => {
            jwt.verify(data["rtoken"], jwtfile.secretkey, (err, data1) => {
                  if (err) {
                        console.log("Error in Authentication in Chatting in Recipient");
                  } else {
                        ChatModel.updateOne({ _id: data["chat_id"] }, { $push: { messages: [data["message"]] } }, (err, docs) => {
                              if (err) {
                                    console.log(err);
                              } else {
                                    io.emit('mes_from_rec', {
                                          msg: data
                                    });
                              }
                        });
                  }
            });
      });
      socket.on('mes_from_org', (data) => {
            jwt.verify(data["otoken"], jwtfile.secretkey, (err, data1) => {
                  if (err) {
                        console.log("Error in Authentication in Chatting in Organization");
                  } else {
                        ChatModel.updateOne({ _id: data["chat_id"] }, { $push: { messages: [data["message"]] } }, (err, docs) => {
                              if (err) {
                                    console.log(err);
                              } else {
                                    io.emit('mes_from_org', {
                                          msg: data
                                    });
                              }
                        });
                  }
            });
      });
});
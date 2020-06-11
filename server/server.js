const socket = require("socket.io");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const DBConnected = require("./db/db.js");

const recipientRoutes = require("./routes/recipient");
const organizationRoutes = require("./routes/organization");
const adminRoutes = require("./routes/admin");
const mailRoutes = require("./routes/nodemailer.js");

const ChatModel = require("./models/chat.js");

const jwt = require("jsonwebtoken");
var jwtfile = require("./jwt/jwt.js");

app.use(bodyparser.json());
app.use(cors())

app.use('/assets', express.static('assets'));

app.use("/email", mailRoutes.routes);
app.use("/recipient", recipientRoutes.routes);
app.use("/organization", organizationRoutes.routes);
app.use("/admin", adminRoutes.routes);

app.get('/', function (req, res) {
      res.send('Hello');
});

server = app.listen(3000);


var io = socket(server);
io.on('connection', (socket) => {
      socket.on('mes_from_rec', (data) => {
            jwt.verify(data["rtoken"], jwtfile.secretkey, (err, data1) => {
                  if (err) {
                        console.log("Error in Authentication in Chatting in Recipient");
                  } else {
                        ChatModel.update({ _id: data["chat_id"] }, { $push: { messages: data["message"] } });
                        io.emit('mes_from_rec', {
                              msg: data
                        });
                  }
            });
      });
      socket.on('mes_from_org', (data) => {
            jwt.verify(data["otoken"], jwtfile.secretkey, (err, data1) => {
                  if (err) {
                        console.log("Error in Authentication in Chatting in Organization");
                  } else {
                        ChatModel.update({ _id: data["chat_id"] }, { $push: { messages: data["message"] } });
                        io.emit('mes_from_org', {
                              msg: data
                        });
                  }
            });
      });
});
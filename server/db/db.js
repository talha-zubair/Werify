const mongoose = require("mongoose");

require('dotenv').config();
const db_url = process.env.LOCALDB;

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error) => {
      if (!error) {
            console.log("Database Connected")
      } else {
            console.log("Error");
      }
});

module.exports = mongoose;
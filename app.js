const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var https = require("https");
var path = require("path");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

var PubNub = require("pubnub");

var pubnub = new PubNub({
    subscribeKey: "sub-c-db832570-885f-11ea-a961-f6bfeb2ef611",
    publishKey: "pub-c-4fe2d8f8-74ed-4d6a-93c4-149e68832d07",
    uuid: "myUniqueUUIDServer",
    secretKey: "sec-c-YWM1MzAyMGYtODljNi00MGJmLWFhM2MtNWVkNjBiNGI5NzEy"
});

app.get("/", function(req,res) {
  res.render("drivers/publish-location");
});

app.get("/test", function(req,res) {
  res.render("drivers/publish-test");
});

app.get("/admin", function(req,res) {
  res.render("adminPortal/subscribe-location");
});

app.get("/testing", function(req,res) {
  res.render("adminPortal/multiplemarkers");
});

app.get("/thanos", function(req,res) {
  res.render("adminPortal/test");
});

pubnub.channelGroups.addChannels(
  {
      channels: ['ch1', 'ch2','ch3'],
      channelGroup: "myChannelGroup"
  }, 
  function(status) {
      if (status.error) {
          console.log("operation failed w/ status: ", status);
      } else {
          console.log("operation done!", status);
      }
  }
);


pubnub.addListener({
    message: function(m,ch) {
        // handle message
        console.log("message recieved:",JSON.stringify(m));
    }
});

pubnub.subscribe({
    channelGroups: ['myChannelGroup'],
}, function (err) {
    console.log(err);
});



  let port = process.env.PORT;
  if(port == null || port == "") {
    port = 3000;
  }

  app.listen(port, function() {
    console.log("Server started Successfully");
  });


  module.exports = app;

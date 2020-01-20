var express = require('express'),
    bodyParser = require("body-parser"),
	connectdb  = require("./../dbconnect"),
	Chats  = require("./../models/schema");

const router = express.Router();

router.get("/", function(req, res) {
	
	res.setHeader("Content-Type", "application/json");
  	res.statusCode = 200;

	connectdb.then(db => {
		// let data = Chats.find({ message: "hello" });
		Chats.find({}).then(chat => {
			res.json(chat);
		});
	});
});

module.exports = router;
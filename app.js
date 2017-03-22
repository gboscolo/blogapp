// based on https://zellwk.com/blog/crud-express-mongodb/
// https://mlab.com/databases/repoblog#users

express = require('express');
const bodyParser= require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb://127.0.0.1:27017/repoblog', (err, database) => {
	// ... start the server
	if(err)
	{
	  return console.log(err);	  
	}
  
	console.log("connected to db");  
	db = database;

	app.listen(3000, function () {
	  console.log('BlogRepo app listening on port 3000!')
	});
  
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/insertpost', (req, res)=>{
	console.log("Inserting " + req.entry);
	if(!req.entry)
	{
		res.type('text/plain');
		res.status(500);
		res.send('500 Server Error');	
	}
	
	var entry = {};
	entry.User = req.entry.User;
	entry.Date = Date.Now();
	var collection = db.collection("posts");
	collection.insert(entry, (err, result)=>{
		if(!err)
		{
			res.type('text/plain');
			res.status(200);
			res.send(result);
		}
		else
		{
			res.type('text/plain');
			res.status(500);
			res.send(err);			
		}
	});
});

app.get('/getall', (req, res)=>{
	console.log("Getting all posts");
	var collection = db.collection("posts");
	collection.find({}, (err, result)=>{
		if(!err)
		{
			res.type('text/plain');
			res.status(200);
			res.send(result);
		}
		else
		{
			res.type('text/plain');
			res.status(500);
			res.send(err);			
		}
	});
});

app.post('/editpost', (req, res)=>{
	
});

app.post('/removepost', (req, res)=>{
	
});

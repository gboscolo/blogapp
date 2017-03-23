// based on https://zellwk.com/blog/crud-express-mongodb/
// https://mlab.com/databases/repoblog#users

express = require('express');
const bodyParser= require('body-parser');
var Guid = require("guid");
var app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
	if(!req.body || !req.body.entry)
	{
		res.type('text/plain');
		res.status(500);
		res.send('500 Server Error');	
	}
	
	console.log("Adding new post");
	
	var entry = {};
	entry.User = req.body.entry.User;
	entry.Text = req.body.entry.Text;
	entry.Id = Guid.create().value;
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
		db.collection("posts").find().toArray((err, result)=>{
		if(!err)
		{
			res.type('text/plain');
			res.status(200);
			var returnList = [];
			for(j=0;j<result.length;j++)
			{
				returnList.push({ User: result[j].User, Text: result[j].Text, Id: result[j].Id });				
			}			
			
			res.send(returnList);
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


/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , mongoose = require('mongoose')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)

io.set('log level', 1)
var db = mongoose.createConnection('localhost', 'campaign_survey');
var schema = mongoose.Schema({},{strict:false});

var Survey = db.model('ppm_umar_yameen', schema);

app.configure(function(){
  //app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser({ uploadDir: __dirname + '/public/files' }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', function(res,res){
	Survey.count({}, function(err, count){
		res.render('index',{survey_count:count});
	});
	
})
app.post('/new-survey', function(req,res){
	var answers = JSON.parse(req.body.answers);
	var survey = new Survey({answers:answers, ip:req.ip, date:new Date()});
	survey.save(function(){
		Survey.count({}, function(err, count){
			io.sockets.emit("count",{count:count});
		});
		res.end();
	});
})
server.listen(5000);

var express = require('express');
var router = express.Router();

// node mysql
var mysql      = require('mysql');
//var connection  = require('express-myconnection'); 
var connection = mysql.createConnection({
  host     : 'localhost', //'db566290755.db.1and1.com',
  user     : 'root', //'dbo566290755',
  socketPath: 'mysql-socket-path',
  password : 'mypass',//'505932qq',
  port : 3306
  //database : 'db566290755'
});


/* Home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Logo quizz backend (for tests)' });
});

/* Get current user's rank*/ 
function get_rank(connection, mail){

	var query = 'SELECT best_score, FIND_IN_SET( best_score, ( SELECT GROUP_CONCAT( best_score' + 
				 'ORDER BY best_score DESC ) FROM users )) AS rank FROM users WHERE mail = ?'

	connection.query(updateQuery, [mail], function(err, rank){
	if(err) {
		console.log('Error in get rank query');
	  	//res.json({"code" : 100, "status" : "Error in get rank query"});
	  		 return 0;
	  	}
	  	else {
	  		return rank[0].rank;
	  	 }

	});
}

/* Function for database requests */
function handle_database(req,res) {

	var mail = req.params.mail;
	var score = req.params.score;
	var rank = 0;
   
        
        var strQuery = 'SELECT * FROM users WHERE mail = ?';
        connection.query(strQuery,[mail], function(err,rows){
            if(err)	{
            	console.log('Error in select query ...\n\n');
	  			//res.json({"code" : 100, "status" : "Error in select query"});
	  			return;
	  		}
	  		else if (rows.length == 0) { // new user
	  			var newUser  = {login: '', mail: mail, best_score: score};
	  			var insertQuery = 'INSERT INTO users SET ?';
	  			connection.query(strQuery, newUser, function(errorInsert,resultInsert){
	  				if(errorInsert) {
	  					console.log('Error in insert query ...\n\n');
	  					//res.json({"code" : 100, "status" : "Error in insert query"});
	  					return;
	  				}
	  				else {
	  					// get user rank;
	  		  			rank = get_rank(connection, mail);
	  		  			connection.release();
	  				}
			});

	  		}
	  		else{ // User already exists 
	  		  var gamer = rows[0];
	  		  console.log(gamer);
	  		  var newScore = gamer.best_score;
	  		  if(score < newScore) {
	  		 	updateQuery = 'UPDATE users SET best_score = ? WHERE mail = ?'
	  		 	connection.query(updateQuery, [newScore, mail], function(errorUpdate, resultUpdate){
	  		 		 if(errorUpdate) {
	  		 		 	console.log('Error in Update query ...\n\n');
	  				 	// res.json({"code" : 100, "status" : "Error in Update query"});
	  				 	 return;
	  				 }
	  				 else {
	  					 score = newScore;

	  				 }

	  		 	 });
	  		  }

	  		  // get user rank;
	  		  rank = get_rank(connection, mail);
	  		 
	  		}
	  		console.log('rank of '+ mail + ' ==>' + rank)
	  		// Send response
	  		res.send(rank);        

        });
}

/* GET classement. */
router.get('/classement/:mail/:score', function(req, res, next) {
	connection.connect(function(err){
		if(!err) {
		    console.log("Database is connected ... \n\n"); 
		    handle_database(req, res); 
		     
		} else {
			console.log(err);
		    console.log("Error connecting database ... \n\n");

		}

	});

	connection.end(); 

});
	
//var app       =    express();
module.exports = router;
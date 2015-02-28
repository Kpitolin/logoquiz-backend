var express = require('express');
var router = express.Router();

var app = require('../app');


/* Home page */
router.get('/', function(req, res) {
  res.render('index', { title: 'Logo quizz backend (for tests)' });
});

/* Function for database requests */
router.get('/classement/:mail/:score', function(req, res) {

	var mail = req.params.mail;
	var score = req.params.score;
	var rank = 0;
   
    req.getConnection(function(err,connection) {

    	if(err){
    		console.log("Error in getConnection");
    		console.log(err);
    		return;
    	}

        var strQuery = 'SELECT * FROM users WHERE mail = ?';
        connection.query(strQuery,[mail], function(err,rows){
            if(err)	{
            	console.log('Error in select query ...\n\n');
	  			return;
	  		}
	  		else if (rows.length == 0) { // new user

	  			var insertQuery = 'INSERT INTO users(login,mail,best_score) VALUES (?,?,?) ';
	  			var login = "log";
	  			connection.query(insertQuery, [login,mail,score], function(errorInsert,resultInsert){
	  				if(errorInsert) {
	  					console.log('Error in insert query ...\n\n');
	  					console.log(errorInsert);

						//res.json({"code" : 100, "status" : "Error in insert query"});
	  					return;
	  				}
	  				else {
	  					console.log('New User is created in the DB...\n\n');
	  				}
			});

	  		}
	  		else{ // User already exists 
	  		  var gamer = rows[0];
	  		  console.log(gamer);
	  		  var oldScore = gamer.best_score;
	  		  if(score > oldScore) {
	  		  var updateQuery = 'UPDATE users SET best_score = ? WHERE mail = ?'
	  		 	connection.query(updateQuery, [score, mail], function(errorUpdate, resultUpdate){
	  		 		 if(errorUpdate) {
	  		 		 	console.log('Error in Update query ...\n\n');
	  				 	// res.json({"code" : 100, "status" : "Error in Update query"});
	  				 	 return;
	  				 }
	  				 else {
	  				 	console.log('User updated ..\n\n');

	  				 }

	  		 	 });
	  		  }
	  		 
	  		}

	  		// get current user's rank

	  		var queryRank = 'SELECT best_score, FIND_IN_SET( best_score, ( SELECT GROUP_CONCAT(best_score ORDER BY best_score DESC ) FROM users )) AS rank FROM users WHERE mail = ?';

			connection.query(queryRank, [mail], function(err, rank){
			if(err) {
				console.log('Error in get rank query');
				console.log(err)

			  		 res.send(0);
			  	}
			  	else {
			  		
			  		console.log('rank of '+ mail + ' ==>');
			  		console.log(rank[0]);
	  				// Send response
	  				res.header("Access-Control-Allow-Origin", "*");
  					res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  				res.type("json");
	  				res.send(rank[0]);  
			  	 }

			});
	  		      

        });
    });
});

module.exports = router;
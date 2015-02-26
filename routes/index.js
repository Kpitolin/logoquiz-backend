var express = require('express');
var router = express.Router();

// node mysql
//var mysql      = require('mysql');
//var connection  = require('express-myconnection'); 
/*var connection = mysql.createConnection({
  host     : 'localhost', //'db566290755.db.1and1.com',
  user     : 'root', //'dbo566290755',
  socketPath: 'mysql-socket-path',
  password : 'mypass',//'505932qq',
  port : 3306
  //database : 'db566290755'
});*/

var app = require('../app');


/* Get current user's rank*/ 
/*function get_user_rank(mail,connection){

	var query = 'SELECT best_score, FIND_IN_SET( best_score, ( SELECT GROUP_CONCAT( best_score' + 
				 'ORDER BY best_score DESC ) FROM users )) AS rank FROM users WHERE mail = ?'

	connection.query(query, [mail], function(err, rank){
	if(err) {
		console.log('Error in get rank query');
		console.log(err);

	  	//res.json({"code" : 100, "status" : "Error in get rank query"});
	  		 return 0;
	  	}
	  	else {
	  		return rank[0].rank;
	  	 }

	});
}*/

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
	  			//res.json({"code" : 100, "status" : "Error in select query"});
	  			return;
	  		}
	  		else if (rows.length == 0) { // new user
	  			//var newUser  = {login: mail, mail: mail, best_score: score};
	  	

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
	  					// get user rank;s
	  		  			//rank = get_user_rank(mail,connection);
	  		  		//	connection.release();
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

	  		  // get user rank;
	  		  //rank = get_user_rank(mail,connection);
	  		 
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
	  				res.send(rank[0]);  
			  	 }

			});
	  		      

        });
    });
});


//router.get('/', home);// home page, welcoming
//router.get('/classement/:mail/:score', get_rank);//route get the user's rank 

/* GET classement. */
/*router.get('/classement/:mail/:score', function(req, res, next) {
	connection.connect(function(err){
		if(err) {
			console.log(err);
		    console.log("Error connecting database ... \n\n");
		     
		} else {

			console.log("Database is connected ... \n\n"); 
			handle_database(req, res); 
		
		}

	});

	connection.end(); 

});*/
	
//var app       =    express();
module.exports = router;
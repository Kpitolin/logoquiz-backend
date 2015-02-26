

/* Get current user's rank*/ 
function get_user_rank(mail){

	var query = 'SELECT best_score, FIND_IN_SET( best_score, ( SELECT GROUP_CONCAT( best_score' + 
				 'ORDER BY best_score DESC ) FROM users )) AS rank FROM users WHERE mail = ?'

	connection.query(updateQuery, [mail], function(err, rank){
	if(err) {
		console.log('Error in get rank query');
	  	//res.json({"code" : 100, "status" : "Error in get rank query"});
	  		 return 0;
	  	}
	  	else {
	  			console.log(rank); // to delete
	  			return rank[0].rank;
	  	 	}

	});
}

/* GET classement. */
exports.get_rank =  function(req, res){

	var mail = req.params.mail;
	var score = req.params.score;
	var rank = 0;
   
    req.getConnection(function(err,connection){
        var selectQuery = 'SELECT * FROM users WHERE mail = ?';
        connection.query(selectQuery,[mail], function(err,rows){
            if(err)	{
            	console.log('Error in select query ...\n\n');
	  			return;
	  		}
	  		else if (rows.length == 0) { // new user
	  			var newUser  = {login: '', mail: mail, best_score: score};
	  			var insertQuery = 'INSERT INTO users SET ?';
	  			connection.query(strQuery, newUser, function(errorInsert,resultInsert){
	  				if(errorInsert) {
	  					console.log('Error in insert query ...\n\n');
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
	  		  rank = get_user_rank(mail);
	  		 
	  		}
	  		console.log('rank of '+ mail + ' ==>' + rank)
	  		// Send response
	  		res.send(rank);        

        });
   });
}

/* GET classement. */
/*exports.get_rank =  function(req, res) {

	req.getConnection(function(err,connection){

		connection.connect(function(err){
			if(!err) {
		   	 		console.log("Database is connected ... \n\n"); 
		    		//handle_database(req, res); 
		     
			} else {
					console.log(err);
		    		console.log("Error connecting database ... \n\n");

				}

		});

	});
}*/
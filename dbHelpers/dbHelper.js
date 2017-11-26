// dependencies
var passwordHash=require('password-hash');
var addToLogs=require('../logs/logs').addToLogs;
var mongoClient=require('mongodb').MongoClient;

// getting constants from config file
const constants=require('../configurations/config').constants;
const logFiles=require('../configurations/config').logFiles;

// exporting checkWithMongo
// checking with mongo if user exists
module.exports.checkWithMongo = function(request, response, next){
  addToLogs(logFiles.authLogFileName, 'Inside checkWithMongo');

// connect to mongo
mongoClient.connect(constants.connectionString+constants.databaseName, function(error, db){
  if(error){
    addToLogs(logFiles.authLogFileName, 'Unable to connect');
    addToLogs(logFiles.authLogFileName, error);
    response.locals.status=constants.failureStatus;
    next();
  }
  else{
    addToLogs(logFiles.authLogFileName, 'Connected');

    // get collection
    db.collection(constants.authInfoCollectionName, function(error, collection){
      if(error){
        db.close();
        addToLogs(logFiles.authLogFileName, 'Unable to find collection');
        addToLogs(logFiles.authLogFileName, error);
        response.locals.status=constants.failureStatus;
        next();
      }
      else{
        // run query on collection and handle result
        collection.findOne({'$and': [{'$or': [{'username': request.body.username}, {'_id': request.body.phone}, {'email': request.body.email}]}]}, function(error, result){
          db.close();
          if(error || !result){
            addToLogs(logFiles.authLogFileName, 'No Result');
            addToLogs(logFiles.authLogFileName, error);
            response.locals.status=constants.failureStatus;
            next();
          }
          else if(result){
            if(passwordHash.verify(request.body.password, result.password)){
              addToLogs(logFiles.authLogFileName, 'Authenticated');
              response.locals.status=constants.successStatus;
              next();
            }
            else{
              addToLogs(logFiles.authLogFileName, 'Invalid Password');
              response.locals.status=constants.failureStatus;
              next();
            }
          }
        });
      }
    });
  }
  });
}

// exporting registerWithMongo
// registering with mongo
module.exports.registerWithMongo=function(request, response, next){
  addToLogs(logFiles.registerLogFileName, 'Inside registerWithMongo');

  // check if all the mandatory fields exists otherwise don't register
  if(request.body.phone == null || request.body.username == null || request.body.password == null || request.body.email == null){
    addToLogs(logFiles.registerLogFileName, 'Not all mandatory fields are present');
    response.locals.status=constants.failureStatus;
    next();
  }else {
    // connect to mongo
    mongoClient.connect(constants.connectionString+constants.databaseName, function(error, db){
      if(error){
        addToLogs(logFiles.registerLogFileName, 'Unable to connect');
        response.locals.status=constants.failureStatus;
        next();
      }
      else{
        addToLogs(logFiles.registerLogFileName, 'Connected');

        // get collection
        db.collection(constants.authInfoCollectionName, function(error, collection){
          if(error){
            db.close();
            addToLogs(logFiles.registerLogFileName, 'Unable to find collection');
            response.locals.status=constants.failureStatus;
            next();
          }
          else{
            // run insert query on mongo and handle result
            collection.insertOne({'_id': request.body.phone, 'username': request.body.username, 'password': passwordHash.generate(request.body.password), 'email': request.body.email}, function(error, result){
              db.close();
              if(error || !result){
                addToLogs(logFiles.registerLogFileName, 'Unable to register');
                response.locals.status=constants.failureStatus;
                next();
              }
              else if(result){
                // console.log(result.result.ok);
                addToLogs(logFiles.registerLogFileName, 'Registered');
                response.locals.status=constants.successStatus;
                next();
              }
            });
          }
        });
      }
    });
  }
}

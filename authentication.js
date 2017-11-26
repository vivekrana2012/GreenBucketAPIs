// dependencies
var express=require('express');
var router=express.Router();
var addToLogs=require('./logs/logs').addToLogs;
var checkWithMongo=require('./dbHelpers/dbHelper').checkWithMongo;
var registerWithMongo=require('./dbHelpers/dbHelper').registerWithMongo;

// getting logfiles from config file
const logFiles=require('./configurations/config').logFiles;

// mapping auth to authentication flow
router.post('/auth', [checkWithMongo], function(request, response){
  addToLogs(logFiles.authLogFileName, 'In final callback, sending response');
  response.json({'status': response.locals.status});
});

// mapping register to registeration flow
router.post('/register', [registerWithMongo], function(request, response){
  addToLogs(logFiles.registerLogFileName, 'In final callback, sending response');
  response.json({'status': response.locals.status});
});

module.exports = router;

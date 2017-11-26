// dependencies
var logFile=require('fs');

module.exports.addToLogs=function(filename ,message){
  logFile.appendFile(filename, '\r\n'+message, function(error){
    if(error) console.log(error);;
  });
}

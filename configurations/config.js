// constants
module.exports.constants = {
  connectionString: 'mongodb://app:app_password%40123@localhost:27017/',
  databaseName: 'users',
  authInfoCollectionName: 'authInfo',
  successStatus: 'success',
  failureStatus: 'failure',
}

// log file names
module.exports.logFiles={
  authLogFileName: './logs/auth-logs.txt',
  registerLogFileName: './logs/register-logs.txt',
}

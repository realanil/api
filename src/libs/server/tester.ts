const gameid:string = process.argv[2];
console.log(gameid)
require('./../../tester/'+gameid+'_tester');

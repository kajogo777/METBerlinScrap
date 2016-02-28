var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

getCredentials();

function getCredentials(uname,pass){
  var stdin = process.stdin, stdout = process.stdout;
  stdin.resume();

  if(!uname){
    stdout.write("Enter GUC username: ");
    stdin.once('data', function(data) {
      getCredentials(data.toString().trim(),pass);
    });
  }else if(!pass){
    stdout.write("Enter GUC password: ");
    stdin.once('data', function(data) {
      getCredentials(uname,data.toString().trim());
    });
  }else{
    scrap(uname, pass);
    process.exit();
  }
}

function scrap(username, password){
  var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
  var url1 = 'http://student.guc.edu.eg/intranet/Faculties/Media%20Engineering%20Technology/GUC%20Berlin%20SS16%20CSEN%206th/';
  var urlmgmnt = 'http://student.guc.edu.eg/intranet/Faculties/Engineering%20&%20Material%20Sciences/Mechatronics%20Engineering/GUC%20Berlin%20SS16%20MCTR%206th/Introduction%20to%20Management/';
  console.log(username + " " + password);
  console.log(auth);
  getMaterials(auth, url1, __dirname);
  getMaterials(auth, urlmgmnt, __dirname + decodeURI('/GUC%20Berlin%20SS16%20CSEN%206th'));
}

function getMaterials(auth, myUrl, rootDir){

  var temp = myUrl.split('/');
  a.pop();
  var newDir = '/' + decodeURI(a.pop());

  request(
          {
            url : myUrl,
            headers : {
                "Authorization" : auth
            }
          },
           function(error, response, html){
              if(!error){
                  var $ = cheerio.load(html);

                  $('a')
                }
            }
  );
}

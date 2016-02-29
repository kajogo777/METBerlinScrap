var fs = require('fs');
var httpntlm = require('httpntlm');
var cheerio = require('cheerio');
//var exec = require('child_process').exec;
var address = 'http://student.guc.edu.eg';
var usname;
var passw;

getCredentials();

function getCredentials(uname,pass){
  var stdin = process.stdin, stdout = process.stdout;
  stdin.resume();

  if(!uname){
    stdout.write("Enter GUC username: ");
    stdin.once('data', function(data){
      getCredentials(data.toString().trim(), pass);
    });
  }else if(!pass){
    stdout.write("Enter GUC password: ");
    stdin.once('data', function(data){
      getCredentials(uname, data.toString().trim());
    });
  }else{
    scrap(uname, pass, function(){process.exit();});
  }
}

function scrap(username, password){
  var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
  var url1 = address + '/intranet/Faculties/Media%20Engineering%20Technology/GUC%20Berlin%20SS16%20CSEN%206th/';
  var urlmgmnt = address + '/intranet/Faculties/Engineering%20&%20Material%20Sciences/Mechatronics%20Engineering/GUC%20Berlin%20SS16%20MCTR%206th/Introduction%20to%20Management/';

  usname = username;
  passw = password;
  getMaterials(url1, __dirname, function(){
    getMaterials(urlmgmnt, __dirname + decodeURI('/GUC%20Berlin%20SS16%20CSEN%206th'));
  });

}

function getMaterials(myUrl, parentDir){

  var temp = myUrl.split('/');

  httpntlm.get({
      url: myUrl,
      username: usname,
      password: passw
  }, function (err, res){
    if(!err){

      var isHtmlDoc = /text\/html/.test(res.headers['content-type']);

      if(isHtmlDoc){
        var $ = cheerio.load(res.body);
        var name = decodeURI( temp[temp.length-2]);
        var newPath = parentDir + '/' + name;

        $('a').each(function(i, elem){
          if( !(/To Parent Directory/.test(elem.children[0].data)) )
          {
            if (!fs.existsSync(newPath)){
                fs.mkdirSync(newPath);
            }
            getMaterials(address + elem.attribs.href, newPath);
          }
        });
      }else{
        if (!fs.existsSync(newPath)){
          var name = decodeURI( temp[temp.length-1]);
          var newPath = parentDir + '/' + name;
          // console.log(`curl --ntlm --negotiate -u \"${usname}\":\"${passw}\" -o \"${newPath}\" \"${myUrl}\"`);
          // exec(`curl --ntlm --negotiate -u \"${usname}\":\"${passw}\" -o \"${newPath}\" \"${myUrl}\"`, function (error, stdout, stderr) {
          //               console.log('stdout: ' + stdout);
          //               console.log('stderr: ' + stderr);
          //               if (error !== null) {
          //                 console.log('exec error: ' + error);
          //               }
          // });
          // var resumer = require('resumer');
          // var buffer = new Buffer(res.body);
          // var stream = resumer().queue(buffer).end();
          // var file = fs.createWriteStream(newPath);
          // stream.pipe(file);
          // stream.on('error', function(err) { console.log(err); });
          // stream.on('finish', function() { file.close(cb) });

          fs.writeFile(newPath, res.body, function(err1){
            if(err1)
            {
              console.log(err1);
            }else {
              console.log("downloaded " + name);
            }
          });
        }
      }
    }else{
      console.log(err);
    }
  });

}

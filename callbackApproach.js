var express = require('express');
var app = express();
var MetaInspector = require('node-metainspector');

app.get('/I/want/title/', function (req, res) {

  var str = req.originalUrl;
  var arr = str.toString().split("address=");
  

for(var i = 1 ; i<arr.length - 1; i++)
{
arr[i] = arr[i].substring(0, arr[i].length - 1);
}

var callbackCounter = 0;

function fetchTitles(url, callback)
{

var client = new MetaInspector(url, { timeout: 10000 });
var title = '';

client.on("fetch", function(){
title = client.title;
callback(null, url, title);
});

 
client.on("error", function(err){
	console.log(err);
        callback(err,url);
});
 
client.fetch();

}

var contents = [];

for(var i = 1 ; i<arr.length; i++)
{
fetchTitles(arr[i], function(err, url ,title) {

if (err)
{
contents.push(url + ' - ' + "NO RESPOSNE");
}
else
{
var line = url + ' - ' + '"' + title + '"';
contents.push(line);
}

callbackCounter++;

if(arr.length <= 2 || callbackCounter == arr.length - 1)
{
var myResponse = "<html><head></head><body><h1> Following are the titles of given websites: </h1><ul>";

for(var k = 0 ; k < contents.length; k++)
{
myResponse += "<li>" + contents[k] + "</li>";
console.log(contents[k]);
}

myResponse += "</ul></body></html>";

res.writeHead(200, {"Content-Type": "text/html"});
	    res.end(myResponse);
}

});
}

});

app.get('*', function(req, res){
  res.status(404)
   .send('404 - Not found');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

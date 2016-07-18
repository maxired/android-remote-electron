// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var adb = require('adbkit')
var client = adb.createClient();
var http = require('http')

var clientWidth =100;
var clientHeight =100;

var video = document.querySelector('#device');
var pump = require('pump')
var rangeParser = require('range-parser')

var fs = require('fs');

var EXPORT = {};
module.exports = EXPORT

var files = {};
var toRead = 'tutu.mp4';



var server = http.createServer(function (req, res) {
  if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

  var id = req.url.slice(1);
  var file = files[id];

  if (!file) {
    res.statusCode = 404
    res.end()
    return
  }

  var range = req.headers.range && rangeParser(file.length, req.headers.range)[0]

  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Type', 'video/mp4')

  if (!range) {
    res.setHeader('Content-Length', file.length)
    if (req.method === 'HEAD') return res.end()
    pump(fs.createReadStream(id), res)
    return
  }

  res.statusCode = 206
  res.setHeader('Content-Length', range.end - range.start + 1)
  res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)
  if (req.method === 'HEAD') return res.end()
  pump(fs.createReadStream(id, range), res)

})



fs.stat(toRead, function (err, st) {
  console.log('fss stat', err);
    if (err) return cb(err)

    var file = files[toRead] = {};

    file.length = st.size

    server.listen(0, function () {
      console.log('Playback server running on port ' + server.address().port);
      video.src = "http://127.0.0.1:" + server.address().port + '/' + toRead;
    });
});

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var adb = require('adbkit')
var client = adb.createClient()

var clientWidth =100;
var clientHeight =100;

var video = document.querySelector('#device');

var sourceBuffer ;

var fs = require('fs');
function sourceOpen(){
  console.log('sourceOpen')
  sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

  var file = fs.createReadStream('tutu.mp4');
  file.on('data', function(data){
  //  console.log('data from ile', data);
    sourceBuffer && sourceBuffer.appendBuffer(new Uint8Array(data);
    //console.log('data on toto', err.length);
  })
  file.on('end', function(data){
    console.log('read all file', sourceBuffer);
      video.play();
  });

//  sourceBuffer.addEventListener('updateend', function (_) {
    //  mediaSource.endOfStream();
  //    video.play();
  //});
}

  //console.log(mediaSource.readyState); // closed
video.src = URL.createObjectURL(mediaSource);
mediaSource.addEventListener('sourceopen', sourceOpen);

function loadImage(device){

  client.shell(device, 'screenrecord -', function(err, toto){
    toto.on('data', function(err, data){
      if(!sourceBuffer){
        console.log('MOt source buffer');
      }
      sourceBuffer && sourceBuffer.appendBuffer(new Uint8Array(data));
      //console.log('data on toto', err.length);
      if(video.paused){
        video.play();
      }
    })
    console.log('err', err, toto)
  });


  /*client.screencap(device, function(err, stream) {

    //console.log('err', err, stream);
    var chunks = [];
    stream.on('readable', function() {
      var chunk = stream.read();
      chunk && chunks.push(chunk);
      });
    stream.on('end', function() {
      var result = Buffer.concat(chunks);
      var string = result.toString('base64')
      IMG.src = 'data:image/png;base64,'+ string;

      setTimeout( function(){
        loadImage(device)}, 100);
    });
    //
  });*/
}


/*
client.listDevices()
  .then(function(devices) {
    const firstDevices = devices[0];
    console.log('filrst devices is', firstDevices);

    loadImage(firstDevices.id);

    client.openMonkey(firstDevices.id, function(err, monkey){

      monkey.getDisplayWidth(function(err, width) {
        monkey.getDisplayHeight(function(err, height) {
          clientWidth = +width;
          clientHeight = +height;
          console.log('Display size is %dx%d', +width, +height, err, width);

      });
    });

      video.ondblclick = function(event){

        monkey.multi()
          .touchDown(10, 1000)
          .sleep(5)
          .touchMove(20, 1000)
          .sleep(5)
          .touchMove(30, 1000)
          .sleep(5)
          .touchMove(40, 1000)
          .sleep(5)
          .touchMove(50, 1000)
          .sleep(5)
          .touchMove(600, 1000)
          .sleep(5)
          .touchUp(100, 1000)
          .sleep(5)
          .execute(function(err) {
          });
        };
      var down = false;
      var move = 0;
      video.onmousedown = function(event){
        var pos = eventToPosition(event);
        monkey.touchDown(pos.X, pos.Y, nop);
        down = true;
        move=0;
      }

      video.onmouseup = function(event){
        var pos = eventToPosition(event);

        monkey.touchUp(pos.X, pos.Y, nop);
        down = false;
      }

      video.onmousemove = function(event){
        if(down){
          move++;
          if(move%10===0){
            var pos = eventToPosition(event);
            console.log('mooove');
            monkey.touchMove(pos.X, pos.Y, nop);
          }
        }
      }

      document.onkeyup = function(event){
        if(event.key !== 'Backspace'){
            monkey.type(event.key, nop);
        }else{
            monkey.press(67, nop)
        }

      }

      video.onclick = function(event){

        var pos = eventToPosition(event);
        monkey.tap(pos.X, pos.Y, function(err){
          //console.log('touched', err)
        //  setTimeout(function(){ loadImage(firstDevices.id)} , 150);
        })
      };

      EXPORT.buttonMenu = function(){
        monkey.press(1, nop)
      }

      EXPORT.buttonHome = function(){
        monkey.press(3, nop)
      }

      EXPORT.buttonBack = function(){
          monkey.press(4, nop)
      }

    })

    function eventToPosition(event){
      return {
        X : Math.floor( event.offsetX *  clientWidth / video.width),
        Y : Math.floor( event.offsetY *  clientHeight / video.height)
      }
    }

    function nop(){}


})

*/
const EXPORT = {};
module.exports = EXPORT


var server = http.createServer(function (req, res) {
  if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

  var id = Number(req.url.slice(1))
  console.log('id is', id);
  var file = list.get(id);

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
    pump(file.createReadStream(), res)
    return
  }

  res.statusCode = 206
  res.setHeader('Content-Length', range.end - range.start + 1)
  res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)
  if (req.method === 'HEAD') return res.end()
  pump(file.createReadStream(range), res)
})

server.listen(0, function () {
  console.log('Playback server running on port ' + server.address().port)
  video.src = 'http://127.0.0.1:' + server.address().port + '/tutu.mp4';
});

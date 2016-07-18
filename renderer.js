// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

function initPlayer(port){

  var WSAvcPlayer = require('./vendor');

  var canvas = document.createElement("canvas");
  canvas.id = 'device';
  document.body.appendChild(canvas);
  // Create h264 player
  var uri = "ws://127.0.0.1:" +port + '/';
  var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
  wsavc.connect(uri);

  setTimeout(function(){
    wsavc.playStream();
  }, 100);

  //for button callbacks
  window.wsavc = wsavc;
  initListener();

}


var http               = require('http');
var express            = require('express');
var AndroidRelay = require('./android');
var app                = express();


  //public website
var server  = http.createServer(app);

var source = {
  width     : 1085,
  height    : 1920
};

var feed    = new AndroidRelay(server, source);

server.listen(0, function () {
  const port = server.address().port;
  initPlayer(port);
});


function initListener(){

var adb = require('adbkit')
var client = adb.createClient();

var clientWidth =100;
var clientHeight =100;

var video = document.querySelector('#device');

var files = {};


var videoDatas = {};

client.listDevices()
  .then(function(devices) {
    const firstDevices = devices[0];

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
        if(event.key === 'Enter'){
          monkey.press(23, nop)
        } else if(event.key === 'Shift'){
            monkey.press(59, nop)
        } else if(event.key === 'Meta'){
          //
        } else if(event.key !== 'Backspace'){
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

      console.log('export buttonMenu');
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
      var videoWidth = video.getBoundingClientRect().width ;
      var videoHeight = video.getBoundingClientRect().height ;

      console.log('event X' , event.offsetX, clientWidth, video.width, Math.floor( event.offsetX *  clientWidth / video.width) ,event.offsetY , Math.floor( event.offsetY *  clientHeight / video.height));
      return {
        X : Math.floor( event.offsetX *  clientWidth / videoWidth),
        Y : Math.floor( event.offsetY *  clientHeight / videoHeight)
      }
    }

    function nop(){}
})

};

var EXPORT = {};

module.exports = EXPORT;

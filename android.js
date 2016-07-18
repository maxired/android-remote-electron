var Class        = require('uclass');
var Server       = require('./_server');

var adb = require('adbkit')
var client = adb.createClient();

var AndroidFeed = new Class({
  Extends : Server,

  options : {
    video_path     : null,
    video_duration : 0,
  },


  get_feed : function(cb){

    client.listDevices()
      .then(function(devices) {
        const firstDevices = devices[0].id;

        client.shell(firstDevices, "screenrecord --output-format=h264 --bit-rate 1000000 -", cb);
      });
  },

});



module.exports = AndroidFeed;

var gpsTime = require('gps-time');

 const getTimeStamp=()=>{
    var unixMS = Date.now();  // 1454168480000
    return gpsTime.toGPSMS(unixMS);
}
module.exports= getTimeStamp;
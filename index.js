const fs = require('fs')

var hrateInterval = setInterval(function () {
    var hrate = fs.readFileSync('custom-hds/hrate.txt', 'utf8');
    document.getElementById("heartRate").innerHTML = hrate;
}, 1000);
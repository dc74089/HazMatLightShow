var init = false;
var grade;
var startTime = false;
var waitForStartInterval = null;

importScripts("https://www.gstatic.com/firebasejs/3.6.2/firebase.js");

var config = {
    apiKey: "AIzaSyC5pUq_4btmqOrQmFGeqQNzIjTCJt7B3NY",
    authDomain: "hazmatlightshow.firebaseapp.com",
    databaseURL: "https://hazmatlightshow.firebaseio.com",
    storageBucket: "hazmatlightshow.appspot.com",
    messagingSenderId: "821370827473"
};

self.addEventListener("message", function (e) {
    grade = e.data;
    console.log("Worker initialized with grade " + grade);
    if(!init) {
        firebase.initializeApp(config);
        var db = firebase.database();
        db.ref().child("startTime").on("value", function (snap) {
            updateStartTime(snap.val());
        });
        //console.log("Init!");
        init = true;
    }
});

function updateStartTime(val) {
    console.log("Start time: " + val);
    startTime = val;
    if (typeof val === 'number') {
        waitForStartInterval = setInterval(waitForStart, 10);
    } else {
        if (waitForStartInterval !== null) {
            console.log("Cancelling Show");
            clearInterval(waitForStartInterval);
            waitForStartInterval = null;
        }
    }
}

function waitForStart() {
    if (startTime <= (new Date).getTime()) {
        clearInterval(waitForStartInterval);
        waitForStartInterval = null;
        show();
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function sendMessage(hex) {
    console.log("Posting message");
    self.postMessage(hex);
}

var sendRGB = function (r, g, b) {
    sendMessage(rgbToHex(r, g, b));
};

var wheelMe = function () {
    var time = (new Date).getTime();
    time /= 100;
    time = Math.round(time);
    sendMessage(wheel(time % 255));
};

function wheel(pos) {
    pos = 255 - pos;
    if(pos < 85) {
        return rgbToHex(255 - pos * 3, 0, pos * 3);
    }
    if(pos < 170) {
        pos -= 85;
        return rgbToHex(0, pos * 3, 255 - pos * 3);
    }
    pos -= 170;
    return rgbToHex(pos * 3, 255 - pos * 3, 0);
}

function show() {
    console.log("Show Start");
    sendRGB(50, 50, 50);
}
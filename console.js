var a, t, countdownDiv;
var socket;
var startTime;
var waitForStartInterval = null;
console.log("Initialized");

addEventListener("load", function () {
    a = document.getElementById("audio");
    countdownDiv = document.getElementById("countdown");

    socket = new WebSocket("ws://localhost:901");
    socket.onopen = function () {
        //TODO: Something here?
    };
    socket.onmessage = function (event) {
        if (event.data == "Authenticated.") {
            console.log("auth");
            document.getElementById("login").style.visibility = "hidden";
            document.getElementById("console").style.visibility = "visible";
            document.getElementById("console2").style.visibility = "visible";
        } else if (event.data.substr(0, 2) == "##") {
            console.log("Received start time");
            setStartTime(parseInt(event.data.substr(2, event.data.length)));
        }
        setDisplay(event.data);
    };
    socket.onclose = function (event) {
        setDisplay("Socket closed");
    };
    socket.onerror = function (event) {
        setDisplay("Socket error");
    };
});

var login = function () {
    pass = document.getElementById("pw");
    console.log(pw.value.hashCode());
    socket.send(pw.value.hashCode());
};

var startShow = function () {
    console.log("Starting Show...");
    stopAccept();
    socket.send("start");
};

var cancelShow = function () {
    console.log("Cancelling Show...");
    socket.send("stop");
    a.pause();
    a.currentTime = 0;
    cleanDB();
    startAccept();
};

var setStartTime = function (val) {
    if (!(typeof val == 'number')) return;
    startTime = val;
    waitForStartInterval = setInterval(waitForStart, 1);
    a.pause();
    a.currentTime = 0;
};

var waitForStart = function () {
    if ((new Date()).getTime() >= startTime) {
        a.play();
        clearInterval(waitForStartInterval);
    }
};

var setDisplay = function (text) {
    countdownDiv.innerHTML = text
};

var startAccept = function () {
    socket.send("startAccepting");
};
var stopAccept = function () {
    socket.send("stopAccepting");
};
var cleanDB = function () {
    socket.send("cleanup");
};

String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
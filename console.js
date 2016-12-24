// Initialize Firebase
var config = {
    apiKey: "AIzaSyC5pUq_4btmqOrQmFGeqQNzIjTCJt7B3NY",
    authDomain: "hazmatlightshow.firebaseapp.com",
    databaseURL: "https://hazmatlightshow.firebaseio.com",
    storageBucket: "hazmatlightshow.appspot.com",
    messagingSenderId: "821370827473"
};
firebase.initializeApp(config);
var db = firebase.database();
var auth = firebase.auth();
var loggedIn = false;
var a, t, countdownDiv;
var startTime;
var waitForStartInterval = null;
console.log("Firebase Initialized");

addEventListener("load", function () {
    a = document.getElementById("audio");
    countdownDiv = document.getElementById("countdown");
});

var login = function () {
    var succeededLogin = true;
    var pass = document.getElementById("pw").value.toString();
    auth.signInWithEmailAndPassword("ftc9277@gmail.com", pass).then(
        function (user) {
            document.getElementById("login").style.visibility = "collapse";
            document.getElementById("console").style.visibility = "visible";
            document.getElementById("console2").style.visibility = "visible";
            console.log("Logged in");
            db.ref().child("startTime").on("value", function (snap) {
                setStartTime(snap.val());
            });
            loggedIn = true
        }, function (error) {
            console.warn(error.message);
            succeededLogin = false
        }
    );
};

var startShow = function () {
    console.log("Starting Show...");
    stopAccept();
    db.ref().child("start").set(true);
};

var cancelShow = function () {
    console.log("Cancelling Show...");
    db.ref().child("start").set(false);
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

var update = function () {
    countdownDiv.innerHTML = "<h1>" + (t - (new Date()).getTime()) + "</h1>";
    if(t < (new Date()).getTime()) {
        clearInterval(waitForStartInterval);
        a.play();
        countdownDiv.innerHTML = "<h1>Playing</h1>";
    }
};

var startAccept = function () {
    db.ref().child("accepting").set(true);
};
var stopAccept = function () {
    db.ref().child("accepting").set(false);
};
var cleanDB = function () {
    db.ref().child("cleanup").set(true);
};
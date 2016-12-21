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
            console.log("Logged in");
            loggedIn = true
        }, function (error) {
            console.warn(error.message);
            succeededLogin = false
        }
    );
};

var startShow = function () {
    console.log("Starting Show...");
    t = (new Date()).getTime();
    t += 3000;

    db.ref().child("startTime").set(t);

    waitForStartInterval = setInterval(update, 10);
};

var update = function () {
    countdownDiv.innerHTML = "<h1>" + (t - (new Date()).getTime()) + "</h1>";
    if(t < (new Date()).getTime()) {
        clearInterval(waitForStartInterval);
        a.play();
        countdownDiv.innerHTML = "<h1>Playing</h1>";
    }
};

var cancelShow = function () {
    console.log("Cancelling Show...");
    db.ref().child("startTime").set(false);
    if(waitForStartInterval) clearInterval(waitForStartInterval);
    waitForStartInterval = null;
    countdownDiv.innerHTML = "";
    a.pause();
    a.currentTime = 0;
};
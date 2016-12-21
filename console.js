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
console.log("Firebase Initialized");

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
    var t = (new Date()).getTime();
    t += 10000;

    db.ref().child("startTime").set(t);
};

var cancelShow = function () {
    db.ref().child("startTime").set(false);
};
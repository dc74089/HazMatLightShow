var init = false;
var grade;
var myKey;
var myRef;
var curr = null;

importScripts("https://www.gstatic.com/firebasejs/3.6.2/firebase.js");

var config = {
    apiKey: "AIzaSyC5pUq_4btmqOrQmFGeqQNzIjTCJt7B3NY",
    authDomain: "hazmatlightshow.firebaseapp.com",
    databaseURL: "https://hazmatlightshow.firebaseio.com",
    storageBucket: "hazmatlightshow.appspot.com",
    messagingSenderId: "821370827473"
};

self.addEventListener("message", function (e) {
    if (!init && typeof e.data == 'number') {
        grade = e.data;
        console.log("Initialized Worker with grade " + grade);

        firebase.initializeApp(config);
        var db = firebase.database();

        myRef = db.ref().child("devices").child("queue").push();
        myKey = myRef.key;
        myRef.set(grade).then(function () {
            console.log("Initialized Firebase with grade " + grade);
            sendMessage(true)
        }).catch(function (err) {
            sendMessage(false)
        });

        db.ref().child("devices").child("all").child(myKey).on("value", function (snap) {
            if (typeof snap.val() == "string") {
                setRGB(snap.val())
            }
            else if (snap.val() == null) {
                sendMessage(false)
            }
        });

        init = true;
    }
});
setInterval(sendRGB, 1000 / 24);

function sendRGB() {
    if (curr != null)
        sendMessage(curr);
}
function setRBG(snap) {
    curr = snap;
}
function sendMessage(hex) {
    self.postMessage(hex);
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
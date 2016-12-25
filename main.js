var c = document.getElementById("canv");
var x = c.getContext("2d");
var grade;
var initInterval;
var init = false;
var curr = null;
var socket;

var initCanvas = function () {
    resizeCanvas();
    x.font = "120px serif";
    x.textAlign = "center";
    wheelMe();
    x.fillStyle = "#000000";
    x.fillText("9", c.width * 0.2, c.height * 0.5);
    x.fillText("10", c.width * 0.4, c.height * 0.5);
    x.fillText("11", c.width * 0.6, c.height * 0.5);
    x.fillText("12", c.width * 0.8, c.height * 0.5);
};
var onClickGrade = function (e) {
    var xProp = e.clientX / c.width;
    if (xProp < 0.1 || xProp > 0.9) return;
    if (xProp > 0.1 && xProp < 0.3) {
        grade = 9;
    }
    if (xProp > 0.3 && xProp < 0.5) {
        grade = 10;
    }
    if (xProp > 0.5 && xProp < 0.7) {
        grade = 11;
    }
    if (xProp > 0.7 && xProp < 0.9) {
        grade = 12;
    }
    clearInterval(initInterval);
    c.removeEventListener("mousedown", onClickGrade);
    initWorker();
};
var resizeCanvas = function () {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
};

window.addEventListener("load", function () {
    initInterval = setInterval(initCanvas, 10);
});
window.addEventListener("resize", resizeCanvas);
gradeListener = c.addEventListener("mousedown", onClickGrade);
setInterval(sendRGB, 1000 / 50);

function initWorker() {
    if (!init) {
        console.log("Initialized internal Worker with grade " + grade);

        socket = new WebSocket("ws://localhost:901");
        socket.onopen = function (event) {
            console.log("Socket open!");
            socket.send(grade);
        };
        socket.onmessage = function (event) {
            console.log("New message: " + event.data);
            if (event.data == grade.toString()) {
                doOnMessage(true);
            } else {
                doOnMessage(event.data)
            }
        };
        socket.onerror = function (event) {
            doOnMessage(false)
        };
        socket.onclose = function (event) {
            doOnMessage(false);
        };

        init = true;
    }
}
function sendRGB() {
    if (curr != null)
        doOnMessage(curr);
}
function doOnMessage(data) {
    console.log("Message from worker! " + data + ", " + typeof data);

    if (typeof data == "string") {
        x.fillStyle = data;
        x.fillRect(0, 0, c.width, c.height);
    } else if (data === true) { //Show is accepting
        if (grade == 9) {
            x.fillStyle = "#ff0000";
        }
        if (grade == 10) {
            x.fillStyle = "#00ffff";
        }
        if (grade == 11) {
            x.fillStyle = "#23f300";
        }
        if (grade == 12) {
            x.fillStyle = "#808080";
        }
        x.fillRect(0, 0, c.width, c.height);
        x.fillStyle = "#000000";
        x.fillText(grade, c.width / 2, c.height / 2);
    } else if (data === false) { //Show is not accepting
        x.fillStyle = '#000000';
        x.fillRect(0, 0, c.width, c.height);
        x.fillStyle = '#808080';
        x.fillText("Show not active", c.width / 2, c.height / 2);
    }
}
function setRGB(snap) {
    curr = snap;
}

var wheelMe = function () {
    var time = (new Date).getTime();
    time /= 100;
    time = Math.round(time);
    x.fillStyle = wheel(time % 255);
    x.fillRect(0, 0, c.width, c.height)
};
function wheel(pos) {
    pos = 255 - pos;
    if (pos < 85) {
        return rgbToHex(255 - pos * 3, 0, pos * 3);
    }
    if (pos < 170) {
        pos -= 85;
        return rgbToHex(0, pos * 3, 255 - pos * 3);
    }
    pos -= 170;
    return rgbToHex(pos * 3, 255 - pos * 3, 0);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
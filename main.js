var c = document.getElementById("canv");
var x = c.getContext("2d");
var worker = new Worker("worker.js");

var resizeCanvas = function () {
    c.width = window.innerWidth;
    c.height = window.innerHeight
};

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

worker.postMessage("hayyy");

worker.onmessage = function (event) {
    data = event.data;
    x.fillStyle = data;
    x.fillRect(0, 0, c.width, c.height);
    console.log("Message from worker! " + data)
};
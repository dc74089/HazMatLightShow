var init = false;

self.addEventListener("message", function (e) {
    console.log(e.data);
    if(!init) {
        setInterval(wheelMe, 10);
        console.log("Init!")
    }
});

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var sendMessage = function (hex) {
    self.postMessage(hex);
};

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
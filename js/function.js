var _URL = window.URL || window.webkitURL; // used to get the size of an image

function getImageSize(file, callback) {
    img = new Image();
    img.onload = function () {
        callback(this.width, this.height);
    };
    img.src = _URL.createObjectURL(file);
}

function getBase64(file, callback) {
    var fr = new FileReader();
    fr.onloadend = function (data) {
        callback(data.target.result)
    }
    fr.readAsDataURL(file)
}

function timeString(string, times) {
    var rtn = '';
    for (var i = 0; i < times; i++) {
        rtn += string
    }
    return rtn
}

len = el => el.length

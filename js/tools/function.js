var _URL = window.URL || window.webkitURL; // used to get the size of an image

function getImageSize(file, callback) {
    img = new Image();
    img.onload = function () {
        callback(this.width, this.height);
    };
    if (typeof file === 'string') {
        // file is base64
        img.src = file;
    } else {
        img.src = _URL.createObjectURL(file);
    }
}

function getBase64(file, callback) {
    var fr = new FileReader();
    fr.onloadend = function (data) {
        callback(data.target.result)
    }
    fr.readAsDataURL(file)
}

function getContent(file, callback) {
    var fr = new FileReader();
    fr.onloadend = function (data) {
        callback(data.target.result)
    }
    fr.readAsText(file)
}

function timeString(string, times) {
    var rtn = '';
    for (var i = 0; i < times; i++) {
        rtn += string
    }
    return rtn
}

len = el => el.length

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function stripTags(string) {
    return $('<p></p>').html(string).text();
}


var UserError = function (message) {
    var err = new Error(message);
    err.name = 'UserError';
    return err;
}


$.fn.exists = function () {
    console.log(this.length != 0)
}

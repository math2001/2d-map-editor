var _URL = window.URL || window.webkitURL; // used to get the size of an image

(function ($) { $(function () {

    if (!FileReader) {
        alert('This app won\'t work properly because there is no FileReader. Please update your browser!');
    }


    TilesToolbar.init();
    ChooseSprite.init();
    Exporter.init(Map_.init().$map);
    Loader.init();


})})(jQuery)

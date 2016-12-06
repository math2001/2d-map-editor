var _URL = window.URL || window.webkitURL; // used to get the size of an image

ChooseSprite = {

    init: function () {
        this.cacheDom();
        this.bindDom();
        // EM.on('uploaded new sprites', )
    },

    cacheDom: function () {
        this.$chooseSprite = $('#choose-sprite');
        this.$chooseSpriteForm = $('#choose-sprite-form');
        this.$sprite = this.$chooseSpriteForm.find('#choose-sprite-input');
        this.$width = this.$chooseSpriteForm.find('#choose-sprite-width');
        this.$height = this.$chooseSpriteForm.find('#choose-sprite-height');
        this.$submit = this.$chooseSprite.find('#choose-sprite-submit');
        this.$alerts = this.$chooseSprite.find('#choose-sprite-alerts');
    },

    updateSprites: function (e) {
        function showError(msg) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.$alerts.html('<div class="alert alert-danger"><span class="glyphicon glyphicon-remove"></span> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg + '</div>');
        }
        showError = showError.bind(this)
        image = this.$sprite[0].files[0]
        width = this.$width.val();
        height = this.$height.val();
        if (!width) {
            return showError('You must specify a width')
        }
        if (!height) {
            return showError('You must specify a height')
        }
        if (!image) {
            return showError('You must chose a file.')
        }
        if (!image.type.match('image.*')) {
            return showError('You must chose an image (got a <code>' + image.type + '</code>)')
        }

        EM.emit('uploadedNewSprites', {
            image: image,
            width: width,
            height: height
        })


    },

    bindDom: function () {
        this.$submit.bind('click', this.updateSprites.bind(this));
    }

};

TilesToolbar = {
    init: function () {
        this.cacheDom();
        this.bindDom();
        this.listenEvents();
    },

    listenEvents: function () {
        var _this = this
        EM.on('uploadedNewSprites', (function (infos) {
            getImageSize(infos.image, (function (width, height) {
                getBase64(infos.image, (function (base64) {
                    infos.base64 = base64.target.result;
                    this.updateTiles(infos, width, height);
                }).bind(this))
            }).bind(this))
        }).bind(this));

        EM.on('changedSelectedTile', function (infos) {
            _this.$tiles.find('.tile.selected').removeClass('selected');
            $(infos.target).addClass('selected');
        })
    },

    updateTiles: function (infos, fullWidth, fullHeight) {
        this.$tiles.html('');
        var nbSpriteWidth = fullWidth / infos.width;
        var nbSpriteHeight = fullHeight / infos.height;
        for (var x = 0; x < nbSpriteWidth; x++) {
            for (var y = 0; y < nbSpriteHeight; y++) {
                this.$tiles.append(`<li class=tile style="background-image: url(${infos.base64}); background-position: ${x * infos.width}px ${y * infos.height}px; width: ${infos.width}px; height: ${infos.height}px"></li>`)
            }
        }
    },

    cacheDom: function () {
        this.$tiles = $('#tiles');
    },

    bindDom: function () {
        this.$tiles.on('click', '.tile', function fireChangeSelectedTile() {
            EM.emit('changedSelectedTile', { target: this })
        });
    }
};

(function ($) { $(function () {

    if (!FileReader) {
        alert('This app won\' work properly because there is no FileReader. Please update your browser!');
    }

    var $map = $('#map');


    TilesToolbar.init();
    ChooseSprite.init();


})})(jQuery)

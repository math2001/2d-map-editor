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

    fireUpdateSprites: function (e) {
        function showError(msg) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.$alerts.html('<div class="alert alert-danger"><span class="glyphicon glyphicon-remove"></span> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg + '</div>');
        }
        showError = showError.bind(this)

        image = this.$sprite[0].files[0];
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
        [width, height] = [parseInt(width), parseInt(height)]
        getImageSize(image, function (fullWidth, fullHeight) {
            getBase64(image, function (base64) {
                EM.emit('chooseNewSprites', { imageName: image.name, fullWidth, fullHeight, width, height, base64 })
            })
        })

    },

    bindDom: function () {
        this.$submit.bind('click', this.fireUpdateSprites.bind(this));
    }

};

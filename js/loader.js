Loader = Base.extend({

    // load sprites, map, or 2d-map

    init: function () {
        this.cacheDom();
        this.bindDom();
        this.$spritesInfos.hide();
    },

    cacheDom: function () {
        this.$modal = $('#load');
        this.$input = this.$modal.find('#load-input');
        this.$submit = $('#load-submit');
        this.$alertsArea = this.$modal.find('.alerts-area');
        this.$spritesInfos = this.$modal.find('#load-sprites-infos');
        this.$spritesWidth = this.$spritesInfos.find('#load-sprites-width');
        this.$spritesHeight = this.$spritesInfos.find('#load-sprites-height');
    },

    fireEvent: function (e) {
        // fire the right event, depending on the file
        var file = this.$input[0].files[0];
        if (!file) {
            this.showAlert('error', 'You need to choose a file.');
            return 'keep open';
        }

        var ext = file.name.split('.').slice(-1)[0];
        if (file.type.match(/image.*/)) {
            // it is some sprites
            var width = this.$spritesWidth.val();
            var height = this.$spritesHeight.val();
            if (!width) {
                return showError('You must specify a width')
            }
            if (!height) {
                return showError('You must specify a height')
            }
            if (!file) {
                return showError('You must chose a file.')
            }
            if (!file.type.match('image.*')) {
                return showError('You must chose an image (got a <code>' + file.type + '</code>)')
            }
            [width, height] = [parseInt(width), parseInt(height)];
            getImageSize(file, function (fullWidth, fullHeight) {
                getBase64(file, function (base64) {
                    EM.fire('newSpritesLoaded', { imageName: file.name, fullWidth, fullHeight, width, height, base64 })
                })
            })
        } else if (MapConverter.canConvert(ext)) {
            // it is a map
            getContent(file, function (content) {
                EM.fire('newMapLoaded', { content, type: ext });
            })
        } else if (ext == '2d-map') {
            // it is a map and some sprites
            getContent(file, function (content) {
                var data = JSON.parse(content);
                EM.fire('newMapLoaded', { content: data.map, type: 'json', isobj: true });
                EM.fire('newSpritesLoaded', data.sprites);
            });
        } else {
            // show error
            console.log('show error', ext, file.type);
        }

        return;

        if (type == '2d-map') {
            return getContent(file, function (content) {
                var data = JSON.parse(content);
                EM.emit('newMapLoaded', { content: JSON.stringify(data.map), type: 'json' })
                delete data.map
                EM.emit('newSpritesLoaded', data);
            })
        }
        // simply loads the content of the file in this case.
        getContent(file, function (content) {
            EM.emit('newMapLoaded', { content, type });
        })
    },

    toggleSpriteInfo: function (e) {
        if (e.data._this.$input[0].files[0].type.match(/image.*/)) {
            e.data._this.$spritesInfos.fadeIn();
        } else {
            e.data._this.$spritesInfos.fadeOut();
        }
    },

    bindDom: function () {
        var _this = this;
        this.$submit.bind('click', function submitLoad() {
            if (!_this.fireEvent.call(_this)) { // successfull
                _this.$modal.modal('hide');
            }
        });
        this.$input.bind('change', {_this: this}, this.toggleSpriteInfo);
    },
});

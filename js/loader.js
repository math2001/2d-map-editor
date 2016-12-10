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
        this.$spritesInfos = this.$modal.find('#load-sprites-infos')
    },

    fireEvent: function (e) {
        // fire the right event, depending on the file
        var file = this.$input[0].files[0];
        if (!file) {
            this.showAlert('error', 'You need to choose a file.');
            return 'keep open';
        }

        var type = file.name.split('.').slice(-1);

        // if (type == '')

        return;

        if (type == '2d-map') {
            return getContent(file, function (content) {
                var data = JSON.parse(content);
                EM.emit('newMapLoaded', { content: JSON.stringify(data.map), type: 'json' })
                delete data.map
                EM.emit('chooseNewSprites', data);
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

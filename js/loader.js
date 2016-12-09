Loader = {

    // Load a map from a file, and fires the event newMapLoaded

    init: function () {
        this.cacheDom();
        this.bindDom();
    },

    cacheDom: function () {
        this.$modal = $('#load');
        this.$input = this.$modal.find('#load-input');
        this.$submit = $('#load-submit');
    },

    fireNewMapLoaded: function (e) {
        // !!! Check that there is a file
        var file = this.$input[0].files[0];
        var type = file.name.split('.').slice(-1);
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

    bindDom: function () {
        var _this = this;
        this.$submit.bind('click', function submitLoad() {
            _this.fireNewMapLoaded.call(_this);
            _this.$modal.modal('hide');
        });
    },
}

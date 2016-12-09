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
        // simply loads the content of the file in this case.
        getContent(file, function (content) {
            EM.emit('newMapLoaded', { file, content, type });
        })
    },

    bindDom: function () {
        this.$submit.bind('click', this.fireNewMapLoaded.bind(this));
    },
}

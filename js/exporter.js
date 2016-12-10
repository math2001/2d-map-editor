Exporter = Base.extend({

    init: function ($map) {
        this.cacheDom($map);
        this.bindDom();
        this.listenEvents();
    },

    listenEvents: function () {
        var _this = this;
        EM.on('newSpritesLoaded', function saveSpritesName(data) {
            _this.sprites = data;
        });
    },

    cacheDom: function ($map) {
        this.$modal = $('#export');
        this.$preview = this.$modal.find('#export-preview');
        this.$form = this.$modal.find('#export-form');
        this.$download = $('#export-download');
        this.$toggler = $('#export-toggler');
        this.$formatBtn = this.$modal.find('[name="export-format"]')
        this.$map = $map;
        this.$alertsArea = this.$modal.find('.alerts-area');
    },

    bindDom: function () {
        this.$toggler.bind('click', {fromToggler: true}, this.updatePreview.bind(this));
        this.$formatBtn.bind('change', this.updatePreview.bind(this));
        this.$download.bind('click', this.download.bind(this));
    },

    download: function () {
        download('{}.{}'.format(this.spritesName || 'map', this.format), this.preview)
    },

    updatePreview: function (e) {
        this.format = this.$form.find('label.active').find('input').data('convert-to');
        this.preview = MapConverter.convertHTMLMapTo((this.format == '2d-map' ? 'json' : this.format),
                                                     this.showAlert.bind(this), this.format != '2d-map');
        if (this.format == '2d-map') {
            if (!this.sprites) {
                this.showAlert('info', 'It is useless to export you map using this format (<code>.2d-map</code>) because you haven\'t chose any sprites yet.');
            }
            // this.preview is an object, not a string (because of the last arg)
            this.preview = JSON.stringify({map: this.preview, sprites: this.sprites})
        }
        this.$preview.html(this.preview);
        if (e.data && e.data.fromToggler) this.$modal.modal('show');
    },

    showAlert: function (type, msg) {
        if (type == 'error') { type = 'danger'; }
        if (type == 'danger') {
            console.error(stripTags(msg));
        }
        this.$alertsArea.append('<div class="alert alert-{}"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>{}</div>'.format(type, msg));
    }

});

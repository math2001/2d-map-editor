Exporter = Base.extend({

    init: function ($map) {
        this.cacheDom($map);
        this.bindDom();
        this.listenEvents();
    },

    listenEvents: function () {
        var _this = this;
        EM.on('chooseNewSprites', function saveSpritesName(data) {
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
        this.$toggler.bind('click', this.updatePreview.bind(this));
        this.$formatBtn.bind('change', this.updatePreview.bind(this));
        this.$download.bind('click', this.download.bind(this));
    },

    download: function () {
        download('{}.{}'.format(this.spritesName || 'map', this.format), this.preview)
    },

    convertMapToObject: function () {
        var map = [],
            $rows = this.$map.children(),
            $cols,
            row;
        for (var i = 0; i < $rows.length; i++) {
            $cols = $($rows[i]).children();
            row = []
            for (var j = 0; j < $cols.length; j++) {
                row.push(parseInt($($cols[j]).attr('data-nb')))
            }
            map.push(row);
        }
        return map
    },

    convertObjTo: function (type, obj) {
        if (type == 'txt') {
            var text = '';
            for (var i = 0; i < obj.length; i++) {
                for (var j = 0; j < obj[i].length; j++) {
                    text += obj[i][j];
                }
                text += '\n';
            }
            return text;
        } else if (type == 'json') {
            return JSON.stringify(obj);
        } else if (type == '2d-map') {
            if (!this.sprites) {
                this.showAlert('error', 'You need to choose some sprites before to save it as a <code>.2d-map</code>.');

            }
            return JSON.stringify($.extend({
                map: obj
            }, this.sprites));
        } else {
            this.showAlert('error', 'Wrong type to convert map to ({}). Internal Error'.format(type));
        }
    },

    updatePreview: function () {
        this.format = this.$form.find('label.active').find('input').data('convert-to');
        this.preview = this.convertObjTo(this.format, this.convertMapToObject())
        this.$preview.html(this.preview);
        this.$modal.modal('show');
    },

    showAlert: function (type, msg) {
        if (type == 'error') { type = 'danger'; }
        if (type == 'danger') {
            console.error(stripTags(msg));
        }
        this.$alertsArea.append('<div class="alert alert-{}"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>{}</div>'.format(type, msg));
    }

});

Exporter = {

    init: function ($map) {
        this.cacheDom($map);
        this.bindDom();
    },

    cacheDom: function ($map) {
        this.$modal = $('#export');
        this.$preview = this.$modal.find('#export-preview');
        this.$form = this.$modal.find('#export-form');
        this.$download = $('#export-dowload');
        this.$toggler = $('#export-toggler');
        this.$formatBtn = this.$modal.find('[name="export-format"]')
        this.$map = $map;
    },
    bindDom: function () {
        this.$toggler.bind('click', this.updatePreview.bind(this));
        this.$formatBtn.bind('change', this.updatePreview.bind(this));
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
                row.push($($cols[j]).attr('data-nb'))
            }
            map.push(row);
        }
        return map
    },

    convertObjTo: function (type, obj) {
        if (type == 'plain') {

            var text = ''
            for (var i = 0; i < obj.length; i++) {
                for (var j = 0; j < obj[i].length; j++) {
                    text += obj[i][j];
                }
                text += '\n';
            }
            return text
        } else if (type == 'json') {
            return JSON.stringify(obj)
        } else {
            format('hello {}', 'matt')
            throw new Error('Wrong type to convert map to ({})'.format(type))
        }
    },

    updatePreview: function () {
        this.$preview.html(this.convertObjTo(this.$form.find('label.active').find('input').data('convert-to'), this.convertMapToObject()));
        this.$modal.modal('show');
    }

}

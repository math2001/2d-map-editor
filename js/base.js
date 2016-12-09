Base = {

    showAlert: function (type, message) {
        if (!this.$alertsArea) {
            throw new Error('No alerts area to show an alert ({}, {}).'.format(type, message));
        }
        if (type == 'error') { type = 'danger'; }
        if (type == 'danger') {
            console.error(stripTags(message));
        }
        this.$alertsArea.append('<div class="alert alert-{}"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>{}</div>'.format(type, message));
    },

    extend: function (obj) {
        return $.extend({}, this, obj)
    }

}

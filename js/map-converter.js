MapConverter = Base.extend({

    // This is a static class

    init: function ($map) {
        MapConverter.$map = $map;
        MapConverter.known_types = ['json', 'txt'];
        return this;
    },

    convertHTMLMapTo: function (type, showAlert, stringify) {
        if (typeof showAlert == 'undefined') {
            showAlert = function () {}
        }
        type = type.toLowerCase();
        // convert html map to <type>
        // showAlert is a function that will be called if an user error occurs

        if (!~$.inArray(type, MapConverter.known_types)) {
            showAlert('error', 'This format (<code>{}</code>) is not supported for now'.format(type));
            return false;
        }

        function convertMapToObj() {
            var map = [],
            $rows = MapConverter.$map.children(),
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
            return map;
        }

        function convertObjTo(type, obj) {
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
            } else {
                showAlert('error', 'Wrong type to convert map to ({}). Internal Error'.format(type));
                return '';
            }
        }

        if (stringify) {
            return convertObjTo(type, convertMapToObj());
        } else {
            return convertMapToObj();
        }
    },

    canConvert: function (type) {
        return ~$.inArray(type, MapConverter.known_types);
    },

    convertXToHTMLMap: function (type, string, showAlert) {

        function convertXToObj(type, string, showAlert) {
            var map = [], row;
            if (type == 'txt') {
                var rows = string.split('\n');
                for (var i = 0; i < rows.length; i++) {
                    row = [];
                    for (var j = 0; j < rows[i].length; j++) {
                        row.push(parseInt(rows[i][j]));
                    }
                    map.push(row);
                }
                return map
            } else if (type === 'json') {
                return JSON.parse(string);
            } else {
                showAlert('error', 'Wrong type to convert map from ({})'.format(type));
                return [];
            }
        }

        function convertObjToHtmlMap(rows) {
            var html = '';
            for (var i = 0; i < rows.length; i++) {
                html += '<tr class="map-row">';
                for (var j = 0; j < rows[i].length; j++) {
                    html += '<td class="map-cell" data-nb="{}"></td>'.format(rows[i][j]);
                }
                html += '</tr>';
            }
            this.$map.html(html);
            return html
        }

        return convertObjToHtmlMap(convertXToObj(type, string));
    }

})

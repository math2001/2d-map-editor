MapConverter = Base.extend((function () {

    class_data = {
        known_types: ['json', 'txt']
    }
    function saveHtml() {

    }


    function init($map) {
        class_data.$map = $map
    }

    function get() {

    }

    function convertXToObj (type, string) {
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
            throw new UserError('Wrong type to convert map from ({})'.format(type));
        }
    }

    function goodFormat(type) {
        return $.inArray(type, known_types)
    }
    return {
        'saveHtml': saveHtml,
        'getInTheFormat': get,
        'init': init,
        'goodFormat': goodFormat
    }

})());

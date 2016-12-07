Map_ = {
    init: function () {
        this.cacheDom();
        this.initTable(5, 5);
        this.listenEvents();
        this.bindDom();

        this.selectedTileNb = null
    },

    cacheDom: function () {
        this.$map = $('#map');
        this.$styleSheet = $('#map-stylesheet')
    },

    initTable: function (rows, cols) {
        var row = '<tr class="map-row">' + timeString('<td class="map-cell" data-nb=0></td>', cols) + '</tr>';

        this.$map.html(timeString(row, rows));
    },

    listenEvents: function () {
        var _this = this
        EM.on('changedSelectedTile', function shareToClass(data) {
            _this.selectedTileNb = data.nb
        });

        EM.on('chooseNewSprites', function updateStyleSheet(data) {
            var css = '';
            var nbSpriteWidth = data.fullWidth / data.width;
            var nbSpriteHeight = data.fullHeight / data.height;
            console.log(data);
            for (var x = 0; x < nbSpriteWidth; x++) {
                for (var y = 0; y < nbSpriteHeight; y++) {
                    css += `<li class=tile style="background-image: url(${data.base64}); background-position: ${x * data.width}px ${y * data.height}px; width: ${data.width}px; height: ${data.height}px"></li>`
                }
            }
            _this.$styleSheet.html(css)
        })
    },

    bindDom: function () {
        var _this = this
        this.$map.on('click', '.map-cell', function changeSprite() {
            $(this).attr('data-nb', _this.selectedTileNb)
        })
    }
};

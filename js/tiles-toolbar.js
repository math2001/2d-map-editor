TilesToolbar = {
    init: function () {
        this.cacheDom();
        this.bindDom();
        this.listenEvents();
    },

    listenEvents: function () {
        var _this = this
        EM.on('chooseNewSprites', this.updateTiles.bind(this))

        EM.on('changedSelectedTile', function (infos) {
            _this.$tiles.find('.tile.selected').removeClass('selected');
            $(infos.target).addClass('selected');
        })
    },

    updateTiles: function (data) {
        this.$tiles.html('');
        var nbSpriteWidth = data.fullWidth / data.width;
        var nbSpriteHeight = data.fullHeight / data.height;
        for (var x = 0; x < nbSpriteWidth; x++) {
            for (var y = 0; y < nbSpriteHeight; y++) {
                this.$tiles.append(`<li class=tile style="background-image: url(${data.base64}); background-position: ${x * data.width}px ${y * data.height}px; width: ${data.width}px; height: ${data.height}px"></li>`)
            }
        }
    },

    cacheDom: function () {
        this.$tiles = $('#tiles');
    },

    bindDom: function () {
        this.$tiles.on('click', '.tile', function fireChangeSelectedTile() {
            EM.emit('changedSelectedTile', { target: this, nb: len($(this).prevAll()) })
        });
    }
};

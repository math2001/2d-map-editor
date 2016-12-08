Map_ = {
    init: function () {
        this.cacheDom();
        this.initTable(5, 5);
        this.listenEvents();
        this.bindDom();
        this.contextMenu();
        this.selectedTileNb = null
        return this
    },

    getMapWidth: function () {
        return len(this.$map.children().first().children())
    },

    rowColsManager: function (key, opt) {
        console.log(key, opt);
        var $parent = opt.$trigger.parent('tr')
        if (key == 'addBefore') {
            $parent.before('<tr>{}</tr>'.format(timeString('<td class="map-cell" data-nb="0"></td>', this.getMapWidth())));
        } else if (key == 'addAfter') {
            $parent.after('<tr>{}</tr>'.format(timeString('<td class="map-cell" data-nb="0"></td>', this.getMapWidth())));
        } else if (key == 'duplicateBefore') {
            $parent.before('<tr>{}</tr>'.format($parent.html()));
        } else if (key == 'duplicateAfter') {
            $parent.after('<tr>{}</tr>'.format($parent.html()));
        } else if (key == 'remove') {
            $parent.remove();
        } else {
            throw new Error('Unknow key {} on context menu.'.format(key))
        }
    },

    contextMenu: function () {
        var _this = this

        $.contextMenu({
            selector: '.map-cell',
            items: {
                rows: {
                    name: "Rows",
                    items: {
                        addBefore: {
                            name: "Insert New Row Above",
                            callback: _this.rowColsManager.bind(_this)
                        },
                        addAfter: {
                            name: "Insert New Row Bellow",
                            callback: _this.rowColsManager.bind(_this)
                        },
                        duplicateBefore: {
                            name: "Duplicate And Insert Above",
                            callback: _this.rowColsManager.bind(_this)
                        },
                        duplicateAfter: {
                            name: "Duplicate And Insert Bellow",
                            callback: _this.rowColsManager.bind(_this)
                        },
                        remove: {
                            name: "Remove",
                            callback: _this.rowColsManager.bind(_this)
                        }
                    }
                }
            }
        })
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

        function updateStyleSheet(data) {
            var css = `.map-cell {background-image: url(${data.base64}); width: ${data.width}px; height: ${data.height}px; } `;
            var nbSpriteWidth = data.fullWidth / data.width;
            var nbSpriteHeight = data.fullHeight / data.height;
            var i = 0;
            // read lign by lign:
            // 1 2 3 4 5
            // 6 7 8 9 10
            for (var y = 0; y < nbSpriteHeight; y++) {
                for (var x = 0; x < nbSpriteWidth; x++) {
                    css += `.map-cell[data-nb="${i}"] {background-position: ${x * data.width}px ${y * data.height}px; } `
                    i++
                }
            }
            _this.$styleSheet.remove()
            $(document.head).append($('<style></style>').attr('type', 'text/css').html(css))
        }

        EM.on('chooseNewSprites', updateStyleSheet);
    },

    bindDom: function () {
        var _this = this;
        _this.mouseIsPressed = false;
        function updateSpriteNb() {
            if (!_this.mouseIsPressed) { return }
            $(this).attr('data-nb', _this.selectedTileNb);
        }
        $(document.body).on('mouseup', function saveMouseUp(e) {
            if (e.button != 0) { return }
            _this.mouseIsPressed = false;
        })

        this.$map.on('mousedown', '.map-cell', function saveMouseDown(e) {
            if (e.button != 0) { return }
            _this.mouseIsPressed = true
            updateSpriteNb.call(this)
        }).on('mousemove', '.map-cell', updateSpriteNb);
    }
};

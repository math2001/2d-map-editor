Map_ = {
    init: function () {
        this.cacheDom();
        this.initTable(5, 5);
        this.listenEvents();
        this.bindDom();
        this.contextMenu();
        this.selectedTileNb = null;

        Map_.TD_CELL_HTML = '<td class="map-cell" data-nb="0"></td>'

        return this;
    },

    getWidth: function () {
        return len(this.$map.children().first().children());
    },

    rowsManager: function (key, opt) {
        var $parent = opt.$trigger.parent('tr');
        if (key == 'addBefore') {
            $parent.before('<tr>{}</tr>'.format(timeString(Map_.TD_CELL_HTML, this.getWidth())));
        } else if (key == 'addAfter') {
            $parent.after('<tr>{}</tr>'.format(timeString(Map_.TD_CELL_HTML, this.getWidth())));
        } else if (key == 'duplicateBefore') {
            $parent.before('<tr>{}</tr>'.format($parent.html()));
        } else if (key == 'duplicateAfter') {
            $parent.after('<tr>{}</tr>'.format($parent.html()));
        } else if (key == 'remove') {
            $parent.remove();
        } else {
            throw new Error('Unknow key {} on context menu.'.format(key));
        }
    },

    colsManager: function (key, opt) {
        var $current_row = opt.$trigger.parent('tr');
        var $rows = $current_row.parent().children();
        var index = $current_row.children().index(opt.$trigger);
        var $el = null;
        if (key == 'addBefore') {
            $rows.each(function (i, row) {
                $($(row).children().get(index)).before(Map_.TD_CELL_HTML);
            });
        } else if (key == 'addAfter') {
            $rows.each(function (i, row) {
                $($(row).children().get(index)).after(Map_.TD_CELL_HTML);
            });
        } else if (key == 'duplicateBefore') {
            $rows.each(function (i, row) {
                $el = $($(row).children().get(index));
                $el.before('<td class="map-cell" data-nb="{}"></td>'.format($el.data('nb')));
            });
        } else if (key == 'duplicateAfter') {
            $rows.each(function (i, row) {
                $el = $($(row).children().get(index));
                $el.after('<td class="map-cell" data-nb="{}"></td>'.format($el.data('nb')));
            });
        } else if (key == 'remove') {
            $rows.each(function (i, row) {
                $($(row).children().get(index)).remove();
            })
        } else {
            throw new Error('Unknow key {} on context menu.'.format(key));
        }
    },

    contextMenu: function () {
        var _this = this;

        $.contextMenu({
            selector: '.map-cell',
            items: {
                rows: {
                    name: "Rows",
                    items: {
                        addBefore: {
                            name: "Insert Empty Row Above",
                            callback: _this.rowsManager.bind(_this),
                            accesskey: "i"
                        },
                        addAfter: {
                            name: "Insert Empty Row Bellow",
                            callback: _this.rowsManager.bind(_this),
                            accesskey: "n"
                        },
                        duplicateBefore: {
                            name: "Duplicate And Insert Above",
                            callback: _this.rowsManager.bind(_this),
                            accesskey: "d"
                        },
                        duplicateAfter: {
                            name: "Duplicate And Insert Bellow",
                            callback: _this.rowsManager.bind(_this),
                            accesskey: "u"
                        },
                        remove: {
                            name: "Remove",
                            callback: _this.rowsManager.bind(_this),
                            accesskey: "r"
                        }
                    }
                },
                cols: {
                    name: "Cols",
                    items: {
                        addBefore: {
                            name: "Insert Empty Column To The Left",
                            callback: _this.colsManager.bind(_this),
                            accesskey: "i"
                        },
                        addAfter: {
                            name: "Insert Empty Column To The Right",
                            callback: _this.colsManager.bind(_this),
                            accesskey: "n"
                        },
                        duplicateBefore: {
                            name: "Duplicate And Insert To The Left",
                            callback: _this.colsManager.bind(_this),
                            accesskey: "d"
                        },
                        duplicateAfter: {
                            name: "Duplicate And Insert To The Right",
                            callback: _this.colsManager.bind(_this),
                            accesskey: "u"
                        },
                        remove: {
                            name: "Remove",
                            callback: _this.colsManager.bind(_this),
                            accesskey: "r"
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

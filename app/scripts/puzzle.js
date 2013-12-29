(function(){

    'use strict';

    var cachePuzzle, cacheKey, cacheDiv;
    var url = 'aXRlbS5waHA/cHV6emxlPXNvbHZlZCZxdWVzdGlkPQ==';
    var and = 'Jg==';

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    var Puzzle = function () {
        function isValidPermutation(state) {
            var numOfTiles = Object.size(state);
            var dim = Math.floor(Math.sqrt(numOfTiles));
            var inversions = 0;
            for(var i = 0; i < numOfTiles; i++) {
                var iTile = state[i].item;
                if(iTile !== 0) {
                    for(var j = i + 1; j < numOfTiles; j++) {
                        var jTile = state[j].item;
                        if(jTile !== 0 && jTile < iTile) {
                            inversions++;
                        }
                    }
                } else {
                    /*jslint bitwise: true */
                    if((dim & 0x1) === 0) {
                        inversions += (1 + Math.floor(i / dim));
                    }
                }
            }
            if((inversions & 0x1) === 1) {
                return false;
            }
            return true;
        }

        function swap(i, j, arr) {
            var temp = arr[i].item;
            arr[i].item = arr[j].item;
            arr[j].item = temp;
        }

        this.getKey = function(arr, value) {
            for(var i = 0; i < Object.size(arr); i++) {
                if(value === arr[i].item) {
                    return arr[i];
                }
            }
        };

        this.getRandomArray = function() {
            var numOfTiles = 16;
            var tiles = {};
            for(var i = numOfTiles - 2; i >= 0; i--) {
                tiles[i] = {key: i, item: i + 1};
            }
            tiles[numOfTiles - 1] = {key: numOfTiles - 1, item: 0};
            var maxTilesToSwap = numOfTiles;
            for(i = 49; i >= 0; i--) {
                var rand1 = Math.floor(Math.random() * maxTilesToSwap);
                var rand2 = Math.floor(Math.random() * maxTilesToSwap);
                if(rand1 === rand2) {
                    /*jslint bitwise: true */
                    if(rand1 < (maxTilesToSwap << 1)) {
                        rand2 = Math.floor(Math.random() * (maxTilesToSwap - rand1)) + rand1;
                    } else {
                        rand2 = Math.floor(Math.random() * rand1);
                    }
                }
                swap(rand1, rand2, tiles);
            }
            if(!isValidPermutation(tiles)) {
                if(tiles[0].item !== 0 && tiles[1].item !== 0) {
                    swap(0, 1, tiles);
                } else {
                    swap(2, 3, tiles);
                }
            }
            return tiles;
        };

    };

    var Base64 = {
        // private property
        _keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        decode : function (input) {
            var output = '';
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                /*jslint bitwise: true */
                chr1 = (enc1 << 2) | (enc2 >> 4);
                /*jslint bitwise: true */
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                /*jslint bitwise: true */
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64.utf8Decode(output);

            return output;

        },

        // private method for UTF-8 decoding
        utf8Decode : function (utftext) {
            var string = '';
            var i = 0;
            var c = 0;
            var c2 = 0;
            var c3 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                /*jslint bitwise: true */
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    /*jslint bitwise: true */
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    };

    function validate() {
        for(var i = 0; i < Object.size(cachePuzzle); i++) {
            if(cachePuzzle[i].item !== cachePuzzle[i].key) {
                return false;
            }
        }
        return true;
    }

    function swap(i, j) {
        var tmp = cachePuzzle[i].item;
        cachePuzzle[i].item = cachePuzzle[j].item;
        cachePuzzle[j].item = tmp;
    }

    function clicker(event) {
        var i = parseInt(event.currentTarget.id);
        var tmp = cacheKey.key;
        if((tmp % 4 !== 0 && i + 1 === tmp) || (tmp + 1) % 4 !== 0 && i - 1 === tmp || i + 4 === tmp || i - 4 === tmp) {
            var attrTmp = event.currentTarget.getAttribute('class');
            var blackSpan = getById(tmp);
            var itemTmp = event.currentTarget.innerHTML;
            event.currentTarget.innerHTML = blackSpan.innerHTML;
            blackSpan.innerHTML = itemTmp;
            event.currentTarget.setAttribute('class', blackSpan.getAttribute('class'));
            blackSpan.setAttribute('class', attrTmp);
            swap(i, tmp);
            cacheKey.key = i;
            if(validate()) {
                var jumpto = getById('jumpto').value;
                var itemid = parseInt(getById('itemid').value);
                var hash = itemid % 137;
                window.location.href = Base64.decode(url) + hash + Base64.decode(and) + jumpto;
            }
        }
    }

    function repaint() {
        cacheDiv.innerHTML = '';
        var data = document.createElement('div');
        for (var i = 0; i < Object.size(cachePuzzle); i++) {
            var newSpan = document.createElement('span');
            var spanName = 'pic' + cachePuzzle[i].item;
            newSpan.setAttribute('class', spanName + ' floater');
            newSpan.setAttribute('id', cachePuzzle[i].key);
            newSpan.innerHTML = (cachePuzzle[i].item);
            newSpan.onclick = clicker;
            data.appendChild(newSpan);
            if(i === 3 || i === 7 || i === 11) {
                var newDiv = document.createElement('div');
                newDiv.setAttribute('style', 'clear: both;');
                data.appendChild(newDiv);
            }
        }
        cacheDiv.appendChild(data);
    }

    function getById(id) {
        return window.document.getElementById(id);
    }

    function init() {
        var puzzle = new Puzzle();
        cachePuzzle = puzzle.getRandomArray();
        var tmp = puzzle.getKey(cachePuzzle, 15);
        cacheKey = {'key': tmp.key, 'item': tmp.item};
        cacheDiv = getById('puzzle');
        repaint();
    }

    init();

})();

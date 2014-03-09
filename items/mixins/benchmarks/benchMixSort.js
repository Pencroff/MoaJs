/**
 * Created by Pencroff on 27.11.13.
 */
/*global require:true, module:true*/
//grunt benchmark:sortBenchmark
var requirejs = require('requirejs');
requirejs.config({
    //Use node's special variable __dirname to
    //get the directory containing this file.
    //Useful if building a library that will
    //be used in node but does not require the
    //use of node outside
    baseUrl: __dirname,
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    paths: {
        'Moa': '../../../moa.min',
        'mixinsSrc/MixSort': '../src/MixSort',
        'mixinsSrc/MixRandom': '../src/MixRandom'
    }
});
requirejs('mixinsSrc/MixSort');
requirejs('mixinsSrc/MixRandom');
var Moa = requirejs('Moa'),
    base = {
        $mixin: {
            sort: 'mixSort',
            mixRandom: 'mixRandom'
        }
    },
    sortFn = function (a, b) {
        'use strict';
        return a - b;
    },
    i,
    smallSize = 25,
    mediumSize = 500,
    bigSize = 5000,
    smallRange = mediumSize / 10,
    bigRange = mediumSize * mediumSize,
    Ctor = Moa.define('base', base),
    item = new Ctor(),
    getRandomArr = function (size, range) {
        'use strict';
        var arr = [];
        arr.length = size;
        for (i = 0; i < size; i += 1) {
            arr[i] = item.getRnd(range);
        }
        return arr;
    },
    getNearlySortedArr = function (a) {
        'use strict';
        var size = a.length,
            noice = size / 3 >> 0,
            arr = a.slice(0).sort(sortFn),
            i,
            index;
        for (i = 0; i < noice; i += 1) {
            index = item.getRnd(size);
            if (index > 0 && index < (size - 2)) {
                item.swap(arr, index, index + 1);
            }
        }
        return arr;
    },
    getReverseArr = function (a) {
        'use strict';
        var size = a.length,
            half = size / 2 >> 0,
            arr = a.slice(0).sort(sortFn),
            index;
        size -= 1;
        for (i = 0; i < half; i += 1) {
            index = size - i;
            item.swap(arr, i, index);
        }
        return arr;
    },
    randomSmallArr = getRandomArr(smallSize, bigRange),
    nearlySortedSmallArr = getNearlySortedArr(randomSmallArr),
    reverseSmallArr = getReverseArr(randomSmallArr),
    fewSmallArr = getRandomArr(smallSize, smallRange);

console.log('Small size: ' + smallSize);

//// A test suite
module.exports = {
    name: 'Sort benchmark',
    tests: {
        'Selection sort': function () {
            'use strict';
            item.selectionSort(randomSmallArr.slice(0), sortFn);
        },
        'One array Merge sort': function () {
            'use strict';
            item.oneMergeSort(randomSmallArr.slice(0), sortFn);
        },
        'Merge sort': function () {
            'use strict';
            item.mergeSort(randomSmallArr.slice(0), sortFn);
        },
        'Hybrid merge sort': function () {
            'use strict';
            item.hybridMergeSort(randomSmallArr.slice(0), sortFn);
        },
        'Comb sort': function () {
            'use strict';
            item.combSort(randomSmallArr.slice(0), sortFn);
        },
        'Insert sort': function () {
            'use strict';
            item.insertSort(randomSmallArr.slice(0), sortFn);
        },
        'Binary insert sort': function () {
            'use strict';
            item.binInsertSort(randomSmallArr.slice(0), sortFn);
        },
        'Quick sort': function () {
            'use strict';
            item.qsort(randomSmallArr.slice(0), sortFn);
        },
        'Native sort': function () {
            'use strict';
            randomSmallArr.slice(0).sort(sortFn);
        },
        'Gnome sort': function () {
            'use strict';
            item.gnomeSort(randomSmallArr.slice(0), sortFn);
        },
        'Shaker sort': function () {
            'use strict';
            item.shakerSort(randomSmallArr.slice(0), sortFn);
        }
    }
};
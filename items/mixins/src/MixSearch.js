/**
 * Created by Pencroff on 17.11.13.
 */
/*global define:true*/
define('mixinsSrc/MixSearch', ['Moa'], function (Moa) {
    "use strict";
    var undef,
        mix = function () {
            this.linearSearch = function (value, colection, lenght) {
                var i;
                for (i = 0; i < lenght; i += 1) {
                    if (colection[i] === value) {
                        return i;
                    }
                }
                return -1;
            };
            this.linearSearchLess = function (value, colection, lenght) {
                var i, first = 0,
                    last = lenght - 1;
                if (lenght === 0 || value <= colection[first]) {
                    return -1;
                }
                if (colection[last] < value) {
                    return last;
                }
                for (i = 0; i < lenght; i += 1) {
                    if (value <= colection[i]) {
                        return (i - 1);
                    }
                }
            };
            this.linearSearchGreater = function (value, colection, lenght) {
                var i, first = 0,
                    last = lenght - 1;
                if (lenght === 0 || value >= colection[last]) {
                    return -1;
                }
                if (colection[first] > value) {
                    return first;
                }
                for (i = 0; i < lenght; i += 1) {
                    if (value < colection[i]) {
                        return i;
                    }
                }
            };
            this.binarySearch = function (value, colection, lenght) {
                var first = 0,
                    last = lenght - 1,
                    mid = (first + last) >> 1,
                    item;
                if (lenght === 0 || colection[first] > value || colection[last] < value) {
                    return -1;
                }
                while (first - last) {
                    item = colection[mid];
                    if (value === item) {
                        return mid;
                    } else if (value < item) {
                        last = mid;
                    } else {
                        first = mid + 1;
                    }
                    mid = (first + last) >> 1;
                }
                if (colection[last] !== value) {
                    return -1;
                }
                return last;
            };
            this.binarySearchGreater = function (value, colection, lenght) {
                var item, prewItem, first = 0,
                    last = lenght - 1,
                    mid = (first + last) >> 1,
                    prewMid = mid - 1;
                if (lenght === 0 || value >= colection[last]) {
                    return -1;
                }
                if (colection[first] > value) {
                    return first;
                }
                while (first - last) {
                    item = colection[mid];
                    prewItem = colection[prewMid];
                    if (value < item && value > prewItem) {
                        return mid;
                    } else if (value < item) {
                        last = mid;
                    } else {
                        first = mid + 1;
                    }
                    mid = (first + last) >> 1;
                }
                return last;
            };
            this.interpolationSearch = function (value, colection, lenght) {
                throw new Error('Not implemented!', 'MixSearch');
            };
        };
    return mix;
});
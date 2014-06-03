/**
 * Created by sergii.danilov on 03/06/2014.
 */

var obj = {},
    addKeysValues = function (o) {
        'use strict';
        var i, len, key, value;
        len = 1000;
        for (i = 0; i < len; i += 1) {
            key = 'key' + i;
            value = 'value' + i;
            o[key] = value;
        }
    },
    arr = [],
    tests = {
        propInOwnObj : function () {
            'use strict';
            var prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    arr.push(obj[prop]);
                }
            }
        },
        propInObj : function () {
            'use strict';
            var prop;
            for (prop in obj) {
                arr.push(obj[prop]);
            }
        },
        keysInObj : function () {
            'use strict';
            var keys = Object.keys(obj),
                len = keys.length,
                i = 0,
                prop;
            while (i < len) {
                prop = keys[i];
                arr.push(obj[prop]);
                i += 1;
            }
        },
        forEachKeysInObj : function () {
            'use strict';
            Object.keys(obj).forEach(function (prop) {
                arr.push(obj[prop]);
            });
        }
    };
addKeysValues(obj);

// A test suite
module.exports = {
    name: 'Iteration benchmark',
    tests: {
        'prop in obj own': {
            defer: false,
            onComplete: function () {
                console.log('prop in obj own: ' + arr.length);
                arr = [];
            },
            fn: tests.propInOwnObj
        },
        'prop in obj': {
            defer: false,
            onComplete: function () {
                console.log('prop in obj: ' + arr.length);
                arr = [];
            },
            fn: tests.propInObj
        },
        'keys in obj': {
            defer: false,
            onComplete: function () {
                console.log('keys in obj: ' + arr.length);
                arr = [];
            },
            fn: tests.keysInObj
        },
        'each keys obj': {
            defer: false,
            onComplete: function () {
                console.log('each keys obj: ' + arr.length);
                arr = [];
            },
            fn: tests.forEachKeysInObj
        }
    }
};
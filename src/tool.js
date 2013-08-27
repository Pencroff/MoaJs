/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 21:09
 */
/*global define:true*/
define('tool', [], function () {
    'use strict';
    var typeObject = 'object',
        typeString = 'string',
        typeNumber = 'number';
    return {
        is: function (obj, type) {
            return typeof obj === type;
        },
        isObject: function (obj) {
            return this.is(obj, typeObject) && obj !== null;
        },
        isString: function (obj) {
            return this.is(obj, typeString);
        },
        isNumber: function (obj) {
            return this.is(obj, typeNumber);
        }
    };
});
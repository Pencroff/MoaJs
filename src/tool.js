/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 21:09
 */
/*global define:true*/
define('tool', ['str'], function (str) {
    'use strict';
    return {
        is: function (obj, type) {
            return typeof obj === type;
        },
        isObject: function (obj) {
            return this.is(obj, str._intrnl_.TObject) && obj !== null;
        },
        isString: function (obj) {
            return this.is(obj, str._intrnl_.TString);
        }
    };
});
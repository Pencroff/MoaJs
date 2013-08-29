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
        isObj: function (obj) {
            return this.is(obj, str._serv_.TObj) && obj !== null;
        },
        isFunc: function (obj) {
            return this.is(obj, str._serv_.TFunc);
        },
        isStr: function (obj) {
            return this.is(obj, str._serv_.TStr);
        },
        isUndef: function (obj) {
            return this.is(obj, str._serv_.TUndef);
        }
    };
});
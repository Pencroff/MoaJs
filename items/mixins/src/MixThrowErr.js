/**
 * Created by Pencroff on 17.11.13.
 */
/*global define:true*/
define('mixinsSrc/MixThrowErr', ['Moa'], function (Moa) {
    "use strict";
    var undef,
        tObj = 'object',
        tFn = 'function',
        tStr = 'string',
        throwErr = function (errMsg) {
            throw new Error(errMsg, 'MixThrowErr');
        },
        mix = function () {
            this.undefErr = function (value, errMsg) {
                if (value === undef) {
                    throwErr(errMsg);
                }
            };
            this.indexOfErr = function (iObj, v, errMsg) {
                if (iObj.indexOf(v) === -1) {
                    throwErr(errMsg);
                }
            };
            this.notInRangeErr = function (i, len, errMsg) {
                if (i > (len - 1)) {
                    throwErr(errMsg);
                }
            };
            this.notInstanceOfErr = function (item, ctor, errMsg) {
                if (!(item instanceof ctor)) {
                    throwErr(errMsg);
                }
            };
            this.notObjErr = function (item, errMsg) {
                if (!(typeof item === tObj && item !== null)) {
                    throwErr(errMsg);
                }
            };
            this.notFnErr = function (fn, errMsg) {
                if (typeof fn !== tFn) {
                    throwErr(errMsg);
                }
            };
            this.notStrErr = function (v, errMsg) {
                if (typeof v !== tStr) {
                    throwErr(errMsg);
                }
            };
            this.notEqualErr = function (a, b, errMsg) {
                if (a !== b) {
                    throwErr(errMsg);
                }
            };
        };
    Moa.mixin('mixThrowErr', mix);
    return mix;
});

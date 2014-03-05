/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 21:09
 */
/*global define:true*/
define('tool', function () {
    'use strict';
    var is = function (obj, type) {
            return typeof obj === type;
        };
    if (!Object.create) {
        Object.create = (function () {
            function F() {}
            return function (o) {
                if (arguments.length !== 1) {
                    throw new Error('Object.create implementation only accepts one parameter.');
                }
                F.prototype = o;
                return new F();
            };
        }());
    }
    return {
        isObj: function (obj) {
            return is(obj, 'object') && obj !== null;
        },
        isFunc: function (obj) {
            return is(obj, 'function');
        },
        isStr: function (obj) {
            return is(obj, 'string');
        },
        isUndef: function (obj) {
            return is(obj, 'undefined');
        },
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        extend: function (target, source, isOverride) {
            var prop;
            if (isOverride) {
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            } else {
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        if (!target[prop]) {
                            target[prop] = source[prop];
                        }
                    }
                }
            }
            return target;
        },
        clone: function (obj, useDeep) {
            var me = this,
                prop,
                i,
                len,
                result = {};
            if (obj instanceof Date) {
                result = new Date(obj);
            } else if (me.isArray(obj)) {
                len = obj.length;
                result = [];
                for (i = 0; i < len; i += 1) {
                    result[i] = me.clone(obj[i], useDeep);
                }
            } else if (me.isObj(obj)) {
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (useDeep === true) {
                            if (me.isObj(obj[prop])) {
                                result[prop] = me.clone(obj[prop], useDeep);
                            } else {
                                result[prop] = obj[prop];
                            }
                        } else {
                            result[prop] = obj[prop];
                        }
                    }
                }
            } else {
                return obj;
            }
            return result;
        },
        isEqual: function (objA, objB, useDeep) {
            // Based on http://stackoverflow.com/questions/1068834/object-comparison-in-javascript/1144249#1144249
            var result = true,
                leftChain,
                rightChain,
                i,
                l,
                compareObj = function (x, y) {
                    var p;
                    // remember that NaN === NaN returns false
                    // and isNaN(undefined) returns true
                    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                        return true;
                    }
                    // Compare primitives and functions.
                    // Check if both arguments link to the same object.
                    // Especially useful on step when comparing prototypes
                    if (x === y) {
                        return true;
                    }
                    // Works in case when functions are created in constructor.
                    // Comparing dates is a common scenario. Another built-ins?
                    // We can even handle functions passed across iframes
                    if ((typeof x === 'function' && typeof y === 'function') ||
                            (x instanceof Date && y instanceof Date) ||
                            (x instanceof RegExp && y instanceof RegExp) ||
                            (x instanceof String && y instanceof String) ||
                            (x instanceof Number && y instanceof Number)) {
                        return x.toString() === y.toString();
                    }
                    // At last checking prototypes as good a we can
                    if (!(x instanceof Object && y instanceof Object)) {
                        return false;
                    }
                    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                        return false;
                    }
                    if (x.constructor !== y.constructor) {
                        return false;
                    }
                    if (x.prototype !== y.prototype) {
                        return false;
                    }
                    // check for infinitive linking loops
                    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                        return false;
                    }
                    // Quick checking of one object beeing a subset of another.
                    // todo: cache the structure of arguments[0] for performance
                    for (p in y) {
                        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                            return false;
                        } else if (typeof y[p] !== typeof x[p]) {
                            return false;
                        }
                    }
                    for (p in x) {
                        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                            return false;
                        } else if (typeof y[p] !== typeof x[p]) {
                            return false;
                        }
                        switch (typeof (x[p])) {
                        case 'object':
                        case 'function':
                            leftChain.push(x);
                            rightChain.push(y);
                            if (!compareObj(x[p], y[p])) {
                                return false;
                            }
                            leftChain.pop();
                            rightChain.pop();
                            break;
                        default:
                            if (x[p] !== y[p]) {
                                return false;
                            }
                            break;
                        }
                    }
                    return true;
                };
            if (useDeep === true) {
//                if (arguments.length < 1) {
//                    result = true; //Die silently? Don't know how to handle such case, please help...
//                    // throw "Need two or more arguments to compare";
//                } else {
//                    for (i = 1, l = arguments.length; i < l; i += 1) {
//
//
//                    }
//                }
                leftChain = []; //todo: this can be cached
                rightChain = [];

                if (!compareObj(objA, objB)) {
                    result = false;
                }

            } else {
                result = JSON.stringify(objA) === JSON.stringify(objB);
            }
            return result;
        }
    };
});
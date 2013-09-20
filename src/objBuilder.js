/** Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 29.08.2013
 * Time: 21:10
 */
/*global define:true*/
define('objBuilder', ['tool'], function (tool) {
    'use strict';
    var helper = {
            $public: function (fn, retObj, obj) {
            },
            $private: {},
            $static: {},
            $extend: {},
            $mixins: {}
        },
        builder = function (objName, objProp, map) {
            var prop,
                instance = {},
                proto = {},
                superObj = {},
                fn;
            for (prop in  objProp) {
                if (objProp.hasOwnProperty(prop)) {
                    switch (prop) {
                    case '$public':
                        break;
                    case '$private':
                        break;
                    case '$static':
                        break;
                    case '$extend':
                        break;
                    case '$mixins':
                        break;
                    case '$proto':
                        break;
                    default:
                        if (tool.isFunc(objProp[prop])) {
                            proto[prop] = objProp[prop];
                        } else {
                            instance[prop] = objProp[prop];
                        }
                    }
                }
            }
            fn = function () {
                return instance;
            };
            fn.prototype = proto;
            return fn;
        };
    return builder;
});

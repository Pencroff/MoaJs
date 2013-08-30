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
            var element,
                instance = {},
                proto = {},
                fn;
            for (element in  objProp) {
                if (objProp.hasOwnProperty(element)) {
                    switch (element) {
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
                    default:
                        if (tool.isFunc(objProp[element])) {
                            proto[element] = objProp[element];
                        } else {
                            instance[element] = objProp[element];
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

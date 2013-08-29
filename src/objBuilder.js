/** Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 29.08.2013
 * Time: 21:10
 */
/*global define:true*/
define('objBuilder', [], function () {
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
                retObj = {},
                fn = function () {
                    return retObj;
                };
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
                    }
                }
            }
    };
    return builder;
});

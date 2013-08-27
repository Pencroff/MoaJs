/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 7:32
 */
/*global define:true*/
define('obj', ['tool'], function (tool) {
    'use strict';
    var obj = function (objName, objProp) {
        if (!tool.isString(objName)) {
            throw new Error('Object Name is not string!');
        }
    };
    return obj;
});
/**
 * Created with JetBrains WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 8/27/13
 * Time: 6:02 PM
 */
/*global define:true*/
/**
 Implementation OOP principles in JavaScript
 @module Moa
 */
define('Moa', ['obj', 'tool'], function (obj, tool) {
    'use strict';
    var _moa = {
        Obj: obj,
        Tool: tool
    };
    return _moa;
});
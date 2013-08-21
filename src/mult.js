/**
 * Created with JetBrains WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 8/21/13
 * Time: 6:49 PM
 */
/*global require:true*/
var add = require('add');

function mult(a, b) {
    'use strict';
    var result = 0,
        i;
    for (i = 0; i < a; i += 1) {
        add(result, b);
    }
    return result;
}


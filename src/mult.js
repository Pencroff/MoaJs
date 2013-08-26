/**
 * Created with JetBrains WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 8/21/13
 * Time: 6:49 PM
 */
/*global define:true*/
define(['add'], function (add) {
    'use strict';
    return function (a, b) {
        var result = 0,
            i;
        for (i = 0; i < a; i += 1) {
            result = add(result, b);
        }
        return result;
    };
});



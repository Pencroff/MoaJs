/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 21.08.2013
 * Time: 23:17
 */
/*global define:true*/
define('math', ['add', 'mult'], function (add, mult) {
    'use strict';
    var text = document.getElementsByTagName('body')[0].innerHTML;
    text += add(8, 7);
    text += '</br>'
    text += mult(8, 7);
    document.getElementsByTagName('body')[0].innerHTML = text;
});

/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 28.08.2013
 * Time: 8:20
 */
/*global define:true*/
define('str', [], function () {
    'use strict';
    return {
        _serv_: {
            TObj: 'object',
            TFunc: 'function',
            TStr: 'string',
            TUndef: 'undefined'
        },
        err: {
            notObj: 'Value is not object',
            notStr: 'Value is not string'
        }
    };
});
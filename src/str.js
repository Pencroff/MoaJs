/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 28.08.2013
 * Time: 8:20
 */
/*global define:true*/
define('str', [], function () {
    'use strict';
    return {
        _intrnl_: {
            prefix: '__moa__',

            TObject: 'object',
            TString: 'string'
        },
        err: {
            notString: 'Object Name is not string!'
        }
    };
});
/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 28.08.2013
 * Time: 0:42
 */
/*global define:true, describe:true, it:true*/
define(['obj', 'chai'], function (obj, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test general behavior "Obj":', function () {
        it('First param is String', function (done) {
            var testData = 'str';
            expect(function () { obj(testData); }).to.not.throw(Error);
            done();
        });
        it('First param is not String', function (done) {
            var testData = 10;
            expect(function () { obj(testData); }).to.throw(Error);
            done();
        });

    });
});
/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 22:03
 */
/*global define:true, describe:true, it:true*/
define(['tool', 'chai'], function (tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test "isString":', function () {
        it('is String', function (done) {
            var testData = 'str';
            expect(tool.isString(testData)).to.be.true;
            done();
        });
        it('is not Number', function (done) {
            var testData = 10;
            expect(tool.isString(testData)).to.be.false;
            done();
        });
        it('is not Boolean', function (done) {
            var testData = true;
            expect(tool.isString(testData)).to.be.false;
            done();
        });
        it('is not Object', function (done) {
            var testData = {};
            expect(tool.isString(testData)).to.be.false;
            done();
        });
        it('is not Undefined', function (done) {
            var testData;
            expect(tool.isString(testData)).to.be.false;
            done();
        });
    });

    describe('Test "isObject":', function () {
        it('is not String', function (done) {
            var testData = 'str';
            expect(tool.isObject(testData)).to.be.false;
            done();
        });
        it('is not Number', function (done) {
            var testData = 10;
            expect(tool.isObject(testData)).to.be.false;
            done();
        });
        it('is not Boolean', function (done) {
            var testData = true;
            expect(tool.isObject(testData)).to.be.false;
            done();
        });
        it('is Object', function (done) {
            var testData = {};
            expect(tool.isObject(testData)).to.be.true;
            done();
        });
        it('is not Null', function (done) {
            var testData = null;
            expect(tool.isObject(testData)).to.be.false;
            done();
        });
        it('is not Undefined', function (done) {
            var testData;
            expect(tool.isObject(testData)).to.be.false;
            done();
        });
    });
});
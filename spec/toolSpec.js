/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 22:03
 */
/*global define:true, describe:true, it:true*/
define(['tool', 'chai'], function (tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test "isStr":', function () {
        it('is String', function (done) {
            var testData = 'str';
            expect(tool.isStr(testData)).to.be.true;
            done();
        });
        it('is not Number', function (done) {
            var testData = 10;
            expect(tool.isStr(testData)).to.be.false;
            done();
        });
        it('is not Boolean', function (done) {
            var testData = true;
            expect(tool.isStr(testData)).to.be.false;
            done();
        });
        it('is not Object', function (done) {
            var testData = {};
            expect(tool.isStr(testData)).to.be.false;
            done();
        });
        it('is not Undefined', function (done) {
            var testData;
            expect(tool.isStr(testData)).to.be.false;
            done();
        });
    });

    describe('Test "isObj":', function () {
        it('is not String', function (done) {
            var testData = 'str';
            expect(tool.isObj(testData)).to.be.false;
            done();
        });
        it('is not Number', function (done) {
            var testData = 10;
            expect(tool.isObj(testData)).to.be.false;
            done();
        });
        it('is not Boolean', function (done) {
            var testData = true;
            expect(tool.isObj(testData)).to.be.false;
            done();
        });
        it('is Object', function (done) {
            var testData = {};
            expect(tool.isObj(testData)).to.be.true;
            done();
        });
        it('is not Null', function (done) {
            var testData = null;
            expect(tool.isObj(testData)).to.be.false;
            done();
        });
        it('is not Undefined', function (done) {
            var testData;
            expect(tool.isObj(testData)).to.be.false;
            done();
        });
    });
    describe('Test "isFunc":', function () {
        it('is Func', function (done) {
            var func = function () {};
            expect(tool.isFunc(func)).to.be.true;
            done();
        });
        it('is not Func', function (done) {
            var func = null;
            expect(tool.isFunc(func)).to.be.false;
            done();
        });
    });

    describe('Test "isUndef":', function () {
        it('is Undef', function (done) {
            var param;
            expect(tool.isUndef(param)).to.be.true;
            done();
        });
        it('is not Undef', function (done) {
            var param = 10;
            expect(tool.isUndef(param)).to.be.false;
            done();
        });
    });
});
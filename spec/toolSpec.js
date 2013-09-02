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

    describe('Test "clone" method', function () {
        var exec = function (inputObj, useDeep) {
            var clonedObj = tool.clone(inputObj, useDeep),
                result = tool.isEqual(inputObj, clonedObj, true);
//            console.log(inputObj);
//            console.log(clonedObj);
//            console.log(result);
            return result;
        };
        it('Deep clone simple types', function (done) {
            var useDeep = true;
            expect(exec(5, useDeep)).to.be.true;
            expect(exec('5', useDeep)).to.be.true;
            expect(exec(true, useDeep)).to.be.true;
            expect(exec(new Date('2013-09-02'), useDeep)).to.be.true;
            done();
        });
        it('Shallow clone simple types', function (done) {
            var useDeep = false;
            expect(exec(5, useDeep)).to.be.true;
            expect(exec('5', useDeep)).to.be.true;
            expect(exec(true, useDeep)).to.be.true;
            expect(exec(new Date('2013-09-02'), useDeep)).to.be.true;
            done();
        });
        it('Deep clone array', function (done) {
            var useDeep = true,
                a = [],
                b = [1, 2, 3],
                c = ['1', '2', '3'],
                d = [true, false, true],
                o = {a: 1, b: 'string', c: function (x) { return (x + 3); } },
                e = [o, o, o];
            expect(exec(a, useDeep)).to.be.true;
            expect(exec(b, useDeep)).to.be.true;
            expect(exec(c, useDeep)).to.be.true;
            expect(exec(d, useDeep)).to.be.true;
            expect(exec(e, useDeep)).to.be.true;
            done();
        });
        it('Shallow clone array', function (done) {
            var useDeep = false,
                a = [],
                b = [1, 2, 3],
                c = ['1', '2', '3'],
                d = [true, false, true],
                o = {a: 1, b: 'string', c: function (x) { return (x + 3); } },
                e = [o, o, o];
            expect(exec(a, useDeep)).to.be.true;
            expect(exec(b, useDeep)).to.be.true;
            expect(exec(c, useDeep)).to.be.true;
            expect(exec(d, useDeep)).to.be.true;
            expect(exec(e, useDeep)).to.be.true;
            done();
        });
        it('Deep clone objects', function (done) {
            var useDeep = true,
                a = {},
                b = {a: 1, b: 'test', c: true},
                c = {oo: b, ff: function (x) { return x;}},
                d = {p1: b, p2: 'test str', p3: c};
            expect(exec(a, useDeep)).to.be.true;
            expect(exec(b, useDeep)).to.be.true;
            expect(exec(c, useDeep)).to.be.true;
            expect(exec(d, useDeep)).to.be.true;
            done();
        });
        it('Shallow clone objects', function (done) {
            var useDeep = false,
                a = {},
                b = {a: 1, b: 'test', c: true},
                c = {oo: b, ff: function (x) { return x;}},
                d = {p1: b, p2: 'test str', p3: c};
            expect(exec(a, useDeep)).to.be.true;
            expect(exec(b, useDeep)).to.be.true;
            expect(exec(c, useDeep)).to.be.true;
            expect(exec(d, useDeep)).to.be.true;
            done();
        });
    });

    describe('Test "isEqual" method', function () {
        it('Deep compare null and undefined', function (done) {
            var u, n1 = null, n2 = null;
            expect(tool.isEqual(n1, n2, true)).to.be.true;
            expect(tool.isEqual(n1, u, true)).to.be.false;
            done();
        });
        it('Compare null and undefined', function (done) {
            var u, n1 = null, n2 = null;
            expect(tool.isEqual(n1, n2)).to.be.true;
            expect(tool.isEqual(n1, u)).to.be.false;
            done();
        });
        it('Deep compare simple types', function (done) {
            expect(tool.isEqual("hi", "hi", true)).to.be.true;
            expect(tool.isEqual(5, 5, true)).to.be.true;
            expect(tool.isEqual(false, false, true)).to.be.true;
            expect(tool.isEqual(true, true, true)).to.be.true;
            expect(tool.isEqual(5, 10, true)).to.be.false;
            expect(tool.isEqual(5, '5', true)).to.be.false;
            expect(tool.isEqual(new Date("2011-03-31"), new Date("2011-03-31"), true)).to.be.true;
            expect(tool.isEqual(new Date("2011-03-31"), new Date("1970-01-01"), true)).to.be.false;
            done();
        });
        it('Compare simple types', function (done) {
            expect(tool.isEqual("hi", "hi")).to.be.true;
            expect(tool.isEqual(5, 5)).to.be.true;
            expect(tool.isEqual(false, false)).to.be.true;
            expect(tool.isEqual(true, true)).to.be.true;
            expect(tool.isEqual(5, 10)).to.be.false;
            expect(tool.isEqual(5, '5')).to.be.false;
            expect(tool.isEqual(new Date("2011-03-31"), new Date("2011-03-31"))).to.be.true;
            expect(tool.isEqual(new Date("2011-03-31"), new Date("1970-01-01"))).to.be.false;
            done();
        });
        it('Deep compare arrays', function (done) {
            expect(tool.isEqual([], [], true)).to.be.true;
            expect(tool.isEqual([1, 2], [1, 2], true)).to.be.true;
            expect(tool.isEqual([1, 2], [2, 1], true)).to.be.false;
            expect(tool.isEqual([1, 2], [1, 2, 3], true)).to.be.false;
            done();
        });
        it('Compare arrays', function (done) {
            expect(tool.isEqual([], [])).to.be.true;
            expect(tool.isEqual([1, 2], [1, 2])).to.be.true;
            expect(tool.isEqual([1, 2], [2, 1])).to.be.false;
            expect(tool.isEqual([1, 2], [1, 2, 3])).to.be.false;
            done();
        });
        it('Deep compare objects', function (done) {
            expect(tool.isEqual({}, {}, true)).to.be.true;
            expect(tool.isEqual({a:1,b:2}, {a:1,b:2}, true)).to.be.true;
            expect(tool.isEqual({a:1,b:2}, {b:2,a:1}, true)).to.be.true;
            expect(tool.isEqual({a:1,b:2}, {a:1,b:3}, true)).to.be.false;
            done();
        });
        it('Compare objects', function (done) {
            expect(tool.isEqual({}, {})).to.be.true;
            expect(tool.isEqual({a:1,b:2}, {a:1,b:2})).to.be.true;
            //expect(tool.isEqual({a:1,b:2}, {b:2,a:1})).to.be.true; // because use JSON.stringify comparison
            expect(tool.isEqual({a:1,b:2}, {a:1,b:3})).to.be.false;
            done();
        });
        it('Deep compare deep objects', function (done) {
            expect(tool.isEqual({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}, true)).to.be.true;
            expect(tool.isEqual({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:27}}, true)).to.be.false;
            done();
        });
        it('Compare deep objects', function (done) {
            expect(tool.isEqual({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:26}})).to.be.true;
            expect(tool.isEqual({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:27}})).to.be.false;
            done();
        });
        it('Deep compare functions', function (done) {
            expect(tool.isEqual(function(x){return x;},function(x){return x;}, true)).to.be.true;
            expect(tool.isEqual(function(x){return x;},function(y){return y+2;}, true)).to.be.false;
            done();
        });
        it('Compare functions', function (done) {
            expect(tool.isEqual(function(x){return x;},function(x){return x;})).to.be.true;
            //expect(tool.isEqual(function(x){return x;},function(y){return y+2;})).to.be.false; // because use JSON.stringify comparison
            done();
        });
        it('Complex comapre objects', function (done) {
            var a = {a: 'text', b:[0,1]},
                b = {a: 'text', b:[0,1]},
                c = {a: 'text', b: 0},
                d = {a: 'text', b: false},
                e = {a: 'text', b:[1,0]},
                f = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }},
                g = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }},
                h = {a: 'text', b:[1,0], f: function(){ this.a = this.b; }},
                i = {
                    a: 'text',
                    c: {
                        b: [1, 0],
                        f: function(){
                            this.a = this.b;
                        }
                    }
                },
                j = {
                    a: 'text',
                    c: {
                        b: [1, 0],
                        f: function(){
                            this.a = this.b;
                        }
                    }
                },
                k = {a: 'text', b: null},
                l = {a: 'text', b: undefined};
            console.log("Deep comparison");
            expect(tool.isEqual(a, b, true)).to.be.true;
            expect(tool.isEqual(a, c, true)).to.be.false;
            expect(tool.isEqual(c, d, true)).to.be.false;
            expect(tool.isEqual(a, e, true)).to.be.false;
            expect(tool.isEqual(f, g, true)).to.be.true;
            expect(tool.isEqual(h, g, true)).to.be.false;
            expect(tool.isEqual(i, j, true)).to.be.true;
            expect(tool.isEqual(d, k, true)).to.be.false;
            expect(tool.isEqual(k, l, true)).to.be.false;
            console.log("JSON comparison");
            expect(tool.isEqual(a, b)).to.be.true;
            expect(tool.isEqual(a, c)).to.be.false;
            expect(tool.isEqual(c, d)).to.be.false;
            expect(tool.isEqual(a, e)).to.be.false;
            expect(tool.isEqual(f, g)).to.be.true;
            //expect(tool.isEqual(h, g)).to.be.false; // because use JSON.stringify comparison
            expect(tool.isEqual(i, j)).to.be.true;
            expect(tool.isEqual(d, k)).to.be.false;
            expect(tool.isEqual(k, l)).to.be.false;
            done();
        });
    });
});
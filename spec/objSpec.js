/**
 * Created with JetBrains WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 8/29/13
 * Time: 5:02 PM
 */
/*global define:true, describe:true, it:true*/
define(['obj', 'chai'], function (obj, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test "Obj" instance:', function () {
        it('The same type for using with "new" and without', function (done) {
//            var instance1 = obj,
//                instance2 = new obj();
//            expect(function () { obj(testData); }).to.not.throw(str.err.notStr);
            done();
        });
        it('Declaration new obj to "map"', function (done) {
            var object = {foo: 'foo'},
                newObj = {action: 'action'},
                o = obj('object', object),
                o2 = obj('object'),
                o3 = new obj('object'),
                newo = new obj('newObject', newObj),
                newo2 = new obj('newObject'),
                newo3 = obj('newObject');
            expect(o).to.equal(o2);
            expect(o).to.equal(o3);
            expect(newo).to.equal(newo2);
            expect(newo).to.equal(newo3);
            done();
        });
    });
});
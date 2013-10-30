/**
 * Created with JetBrains WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 8/29/13
 * Time: 5:02 PM
 */
/*global define:true, describe:true, it:true*/
define(['obj', 'tool', 'chai'], function (obj, tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test "Obj" instance:', function () {
        it('Define simple object', function (done) {
            var simpleObj = {
                    testProp: 'Name',
                    getTestProp: function () {
                        return this.testProp;
                    }
                },
                constructorFn,
                item;
            constructorFn = obj.define('simpleClass', simpleObj);
            item = new constructorFn();
            expect(constructorFn).to.be.a('function');
            expect(constructorFn.prototype).to.have.ownProperty('getTestProp');
            expect(constructorFn).to.not.have.ownProperty('getTestProp');
            expect(item).to.have.ownProperty('testProp');
            expect(item.testProp === item.getTestProp()).to.true;
            done();
        });

        it('Test $extend object', function (done) {
            var base = {
                    testProp: 'Name',
                    getTestProp: function () {
                        return this.testProp;
                    },
                    getConst: function () {
                        return 3;
                    }
                },
                child = {
                    $extend: 'base',
                    testProp: 'Child name',
                    getConst: function () {
                        return 5;
                    },
                    extraMethod: function () {
                        return 'Extra:' + this.testProp;
                    }
                },
                subChild = {
                    $extend: 'child',
                    testProp: 'Sub Child'
                },
                constructorFn,
                baseConstrauctor,
                item, item2;
            baseConstrauctor = obj.define('base', base);
            constructorFn = obj.define('child', child);
            item =  new constructorFn();
            expect(constructorFn).to.be.a('function');
            expect(constructorFn.prototype).to.have.ownProperty('extraMethod');
            expect(constructorFn.prototype).to.have.ownProperty('getConst');
            expect(constructorFn.prototype).to.not.have.ownProperty('getTestProp');
            expect(constructorFn.prototype).to.have.ownProperty('$baseproto');
            expect(constructorFn.prototype).to.have.ownProperty('$base');
            expect(constructorFn.prototype).to.have.ownProperty('$getType');
            expect(constructorFn).to.not.have.ownProperty('getTestProp');
            expect(item).to.have.ownProperty('testProp');
            expect(item).to.not.have.ownProperty('$extend');
            expect(item.testProp === 'Child name').to.true;
            expect(item.getTestProp() === 'Child name').to.true;
            expect(item.extraMethod() === 'Extra:Child name').to.true;
            expect(item.getConst() === 5).to.true;
            expect(item.$base === baseConstrauctor).to.true;
            expect(item.$baseproto === baseConstrauctor.prototype).to.true;
            expect(item.$getType() === 'child').to.true;
            constructorFn = obj.define('subchild', subChild);
            item =  new constructorFn();
            item2 = new constructorFn();
            expect(item.getTestProp() === 'Sub Child').to.true;
            expect(item.extraMethod() === 'Extra:Sub Child').to.true;
            expect(item.getConst() === 5).to.true;
            expect(item !== item2).to.true;
            expect(tool.isEqual(item, item2)).to.true;
            done();
        });

//        it('The same type for using with "new" and without', function (done) {
//            var simpleObj = {
//                itemNo: 1,
//                itemName: 'Name',
//                objString: function () {
//                    var me = this,
//                        str = '';
//                    str += me.itemNo;
//                    str += ' :: ';
//                    str += me.itemName;
//                    return str;
//                }
//            },
//                simpleFirst = obj('simple', simpleObj),
//                simple = obj('simple'),
//                simple2 = obj('simple'),
//                simpleNew = new obj('simple');
//            expect(simpleFirst.objString()).to.equal('1 :: Name');
//            expect(simple).to.equal(simpleNew);
//            expect(simple === simple2).to.false;
//            expect(simple.objString()).to.equal('1 :: Name');
//            expect(simpleNew.objString()).to.equal('1 :: Name');
//            done();
//        });
//        it('Declaration new obj to "map"', function (done) {
//            var object = {foo: 'foo'},
//                newObj = {action: 'action'},
//                o = obj('object', object),
//                o2 = obj('object'),
//                o3 = new obj('object'),
//                newo = new obj('newObject', newObj),
//                newo2 = new obj('newObject'),
//                newo3 = obj('newObject');
//            expect(o).to.equal(o2);
//            expect(o).to.equal(o3);
//            expect(newo).to.equal(newo2);
//            expect(newo).to.equal(newo3);
//            done();
//        });
    });
});
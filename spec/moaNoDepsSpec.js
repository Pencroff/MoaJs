/**
 * Created with WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 10/31/13
 * Time: 6:11 PM
 */
/*global define:true, describe:true, it:true*/
define(['moa-noDeps', 'tool', 'chai'], function (obj, tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test "Moa" noDep instance', function () {
        it('Define simple object', function (done) {
            var simpleObj = {
                    $construct: function (item, prop) {
                        this.item = item;
                        this.prop = prop;
                    },
                    testProp: 'Name',
                    getTestProp: function () {
                        return this.testProp;
                    }
                },
                constructorFn,
                item, item2;
            expect(function () {obj.define()}).to.throw('Wrong parameters in define');
            expect(function () {obj.define('type', {}, 1)}).to.throw('Wrong parameters in define');
            constructorFn = obj.define('simpleClass', simpleObj);
            item = new constructorFn(1, 'a');
            expect(constructorFn).to.be.a('function');
            expect(constructorFn.prototype).to.have.ownProperty('getTestProp');
            expect(constructorFn.prototype).to.have.ownProperty('testProp');
            expect(item).to.have.ownProperty('item');
            expect(item).to.have.ownProperty('prop');
            expect(item.getTestProp()).to.equal(item.testProp);
            expect(item.item).to.equal(1);
            expect(item.prop).to.equal('a');
            item = obj.create('simpleClass', 1, 'a');
            expect(item).to.have.ownProperty('item');
            expect(item).to.have.ownProperty('prop');
            expect(item.getTestProp()).to.equal(item.testProp);
            expect(item.item).to.equal(1);
            expect(item.prop).to.equal('a');
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
            expect(constructorFn.prototype).to.have.ownProperty('testProp');
            expect(item).to.not.have.ownProperty('$extend');
            expect(constructorFn.prototype).to.not.have.ownProperty('$extend');
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
        it('Get defined constructor', function (done) {
            var simpleObj = {
                    testProp: 'Name',
                    getTestProp: function () {
                        return this.testProp;
                    }
                },
                constructorFn,
                constructor2;
            constructorFn = obj.define('simpleClass', simpleObj);
            constructor2 = obj.define('simpleClass');
            expect(constructorFn === constructor2).to.true;
            expect(function () {obj.define('wrongClass')}).to.throw('Object \'wrongClass\' not found');
            done();
        });
        it('Test create method', function (done) {
            var simpleObj = {
                    $construct: function (item, prop) {
                        this.item = item;
                        this.prop = prop;
                    },
                    testProp: 'Name',
                    getTestProp: function () {
                        return this.testProp;
                    }
                },
                ConstructorFn,
                item,
                itemCreate;
            ConstructorFn = obj.define('simpleClass', simpleObj);
            item = new ConstructorFn();
            itemCreate = obj.create('simpleClass');
            expect(tool.isEqual(item, itemCreate)).to.true;
            expect(itemCreate instanceof ConstructorFn).to.true;
            item = obj.create('simpleClass', 'Obj Name', 'New Name');
            expect(item).to.have.ownProperty('item');
            expect(item).to.have.ownProperty('prop');
            expect(item.item).to.equal('Obj Name');
            expect(item.prop).to.equal('New Name');
            expect(item.testProp === 'Name').to.true;
            expect(item.getTestProp() === 'Name').to.true;
            done();
        });
    });
});
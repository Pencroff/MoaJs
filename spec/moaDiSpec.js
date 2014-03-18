/**
 * Created by Pencroff on 13.03.14.
 */
/*global define:true, describe:true, it:true*/
define(['Moa', 'tool', 'chai'], function (Moa, tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test Moa Di implementation', function () {
        it('Test resolving without dependency', function (done) {
            var itemA, itemB;
            Moa.define('typeA', {});
            Moa.define('typeB', {});

            itemA = Moa.resolve('typeA');
            itemB = Moa.resolve('typeB');
            expect(itemA).to.be.an('object');
            expect(itemB).to.be.an('object');
            expect(itemA.getType()).to.equal('typeA');
            expect(itemB.getType()).to.equal('typeB');

            // Clear Moa
            Moa.define('typeA', null);
            Moa.define('typeB', null);
            done();
        });
        it('Test resolving $current config', function (done) {
            var itemA, itemB, itemC;
            Moa.define('typeA', {
                $di: {
                    $current: {
                        type: 'notTypeA', // can not use for $current
                        instance: 'item', // can not use for $current
                        lifestyle: 'transient'
                    }
                }
            });
            Moa.define('typeB', {
                $di: {
                    $current: {
                        instance: 'item',
                        lifestyle: 'singleton'
                    }
                }
            });
            Moa.define('typeC', {
                $di: {
                    $current: {
                        instance: 'ctor'
                    }
                }
            });

            itemA = Moa.resolve('typeA');
            itemB = Moa.resolve('typeB');
            expect(itemA).to.be.an('object');
            expect(itemB).to.be.an('object');
            expect(itemA.getType()).to.equal('typeA');
            expect(itemB.getType()).to.equal('typeB');

            // Clear Moa
            Moa.define('typeA', null);
            Moa.define('typeB', null);
            done();
        });
        it('Test simple property injection', function (done) {
            done();
            var item, item2;
            Moa.define('typeA', {});
            Moa.define('typeB', {});
            Moa.define('bigTypeA', {
                $di: {
                    a: 'typeA',
                    b: 'typeB',
                    c: 'str',
                    d: 3214,
                    e: false
                }
            });
            item = Moa.resolve('bigTypeA');
            expect(item.a).to.be.an('object');
            expect(item.b).to.be.an('object');
            expect(item.c).to.be.an('string');
            expect(item.d).to.be.an('number');
            expect(item.e).to.be.an('boolean');
            expect(item.a.getType()).to.equal('typeA');
            expect(item.b.getType()).to.equal('typeB');
            expect(item.c).to.equal('str');
            expect(item.d).to.equal(3214);
            expect(item.e).to.equal(false);
            expect(function () {
                Moa.resolve();
            }).to.throw('Wrong parameters in resolve');
            expect(function () {
                Moa.resolve('bigTypeA', {}, true);
            }).to.throw('Wrong parameters in resolve');

            item2 = Moa.resolve('bigTypeA');
            expect(item.a).to.not.equal(item2.a);
            expect(item.b).to.not.equal(item2.b);

            done();
        });
        it('Test ctor injection', function (done) {
            done();
            var item, item2;
            Moa.define('typeA', {});
            Moa.define('typeB', {});
            Moa.define('bigTypeA', {
                $ctor: function (config) {
                    this.objA = config.objA;
                    this.objB = config.objB;
                    this.str = config.str;
                    this.num = config.num;
                    this.flag = config.flag;
                    this.undef = config.notDefined;
                },
                $di: {
                    $ctor: {
                        objA: 'typeA',
                        objB: 'typeB'
                    }
                }
//                $di example
//                $di: {
//                    //bindMixin: true, // false
//                    $ctor: {
//                        objA: 'typeA', // default instance: 'item' and lifestyle: 'transient'
//                        objB: {
//                            type: 'typeB',
//                            instance: 'item',
//                            lifestyle: 'transient' //'singleton'
//                        },
//                        fnD: {
//                            type: 'typeD',
//                            instance: 'ctor'
//                            // lifestyle is not used for 'ctor' instance
//                        }
//                    }
//                }
            });
            item = Moa.resolve('bigTypeA', {
                str: 'QWERTY',
                num: 1403,
                flag: true,
                objB: 'will be overrided by $di config'

            });
            expect(item.objA).to.be.an('object');
            expect(item.objB).to.be.an('object');
            expect(item.str).to.be.an('string');
            expect(item.num).to.be.an('number');
            expect(item.flag).to.be.an('boolean');
            expect(item.undef).to.be.undefined;
            expect(item.objA.getType()).to.equal('typeA');
            expect(item.objB.getType()).to.equal('typeB');
            expect(item.str).to.equal('QWERTY');
            expect(item.num).to.equal(1403);
            expect(item.flag).to.equal(true);

            item2 = Moa.resolve('bigTypeA');
            expect(item.objA).to.not.equal(item2.objA);
            expect(item.objB).to.not.equal(item2.objB);

            done();
        });
        it('Test "ctor" func injection', function (done) {
            done();
            var item, ctorItem;
            done();
            Moa.define('typeA', {});
            Moa.define('typeB', {});
            Moa.define('bigType', {
                $ctor: function (config) {
                    this.objA = config.objA;
                },
                $di: {
                    $ctor: {
                        objA: {
                            type: 'typeA',
                            instance: 'ctor'
                        }
                    },
                    objB: {
                        type: 'typeB',
                        instance: 'ctor'
                    }
                }
            });
            item = Moa.resolve('bigType');
            expect(item.objA).to.be.an('function');
            expect(item.objB).to.be.an('function');
            ctorItem = new item.objA();
            expect(ctorItem.getType()).to.equal('typeA');
            ctorItem = new item.objB();
            expect(ctorItem.getType()).to.equal('typeB');
            done();
        });
        it('Test singleton item injection', function (done) {

            done();
        });
        it('Test hierarchy injection', function (done) {

            done();
        });
    });
});
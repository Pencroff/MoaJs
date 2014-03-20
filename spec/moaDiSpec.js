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
            var itemX, itemA, itemB, CtorC, itemC;
            Moa.define('typeX', {});
            Moa.define('typeA', {
                $ctor: function (config) {
                    this.prop = config.a;
                },
                $di: {
                    $current: {
                        // default behavior
                        type: 'notTypeA', // can not use for $current
                        instance: 'item',
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

            itemX = Moa.resolve('typeX');
            itemA = Moa.resolve('typeA', {a: 'some init data'});
            itemB = Moa.resolve('typeB');
            CtorC = Moa.resolve('typeC');
            expect(itemX).to.be.an('object');
            expect(itemA).to.be.an('object');

            expect(itemB).to.be.an('object');
            expect(itemB).to.equal(Moa.resolve('typeB'));

            expect(CtorC).to.be.an('function');
            itemC = new CtorC();

            expect(itemX.getType()).to.equal('typeX');
            expect(itemA.getType()).to.equal('typeA');
            expect(itemA.prop).to.equal('some init data');
            expect(itemB.getType()).to.equal('typeB');
            expect(itemC.getType()).to.equal('typeC');

            // Clear Moa
            Moa.define('typeA', null);
            Moa.define('typeB', null);
            done();
        });
        it('Test simple property injection', function (done) {
            var item, item2, di;
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
            di = Moa.getTypeInfo('bigTypeA').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'bigTypeA',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                a: {
                    type: 'typeA',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                b: {
                    type: 'typeB',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                c: 'str',
                d: 3214,
                e: false
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
            var item, ctorItem, di;
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
            di = Moa.getTypeInfo('bigType').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'bigType',
                    instance: 'item',
                    lifestyle: 'transient'
                },
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
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
            var item, item2, di,
                obj = {
                    name: 'Object',
                    age: 10
                };
            Moa.define('typeA', {});
            Moa.define('typeB', {});
            Moa.define('bigTypeA', {
                $di: {
                    a: 'typeA',
                    b: 'typeB',
                    c: 'str',
                    d: 3214,
                    e: false,
                    f: obj
                }
            });
            di = Moa.getTypeInfo('bigTypeA').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'bigTypeA',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                $prop: {
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
                    e: false,
                    f: {
                        name: 'Object',
                        age: 10
                    }
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
            expect(item.f).to.equal(obj);
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
            var item, item2, di;
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
            });
            di = Moa.getTypeInfo('bigTypeA').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'bigTypeA',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                $ctor: {
                    objA: {
                        type: 'typeA',
                        instance: 'item',
                        lifestyle: 'transient'
                    },
                    objB: {
                        type: 'typeB',
                        instance: 'item',
                        lifestyle: 'transient'
                    }
                }
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
            Moa.define('typeC', {
                $di: {
                    $current: {
                        instance: 'ctor'
                    }
                }
            });
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
                    },
                    c: 'typeC'
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
                $prop: {
                    objB: {
                        type: 'typeB',
                        instance: 'ctor'
                    },
                    c: {
                        type: 'typeC',
                        instance: 'ctor'
                    }
                }
            });
            item = Moa.resolve('bigType');
            expect(item.objA).to.be.an('function');
            expect(item.objB).to.be.an('function');
            expect(item.c).to.be.an('function');
            ctorItem = new item.objA();
            expect(ctorItem.getType()).to.equal('typeA');
            ctorItem = new item.objB();
            expect(ctorItem.getType()).to.equal('typeB');
            ctorItem = new item.c();
            expect(ctorItem.getType()).to.equal('typeC');
            done();
        });
        it('Test singleton item injection', function (done) {
            var item, item2, di;
            Moa.define('typeA', {
                $di: {
                    $current: {
                        lifestyle: 'singleton'
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
            Moa.define('bigType', {
                $ctor: function (config) {
                    this.objA = config.objA;
                },
                $di: {
                    $ctor: {
                        objA: 'typeA'
                    },
                    objB: 'typeB'
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
                        instance: 'item',
                        lifestyle: 'singleton'
                    }
                },
                $prop: {
                    objB: {
                        type: 'typeB',
                        instance: 'item',
                        lifestyle: 'singleton'
                    }
                }
            });
            item = Moa.resolve('bigType');
            item2 = Moa.resolve('bigType');
            expect(item).to.not.equal(item2);
            expect(item.objA).to.equal(item2.objA);
            expect(item.objB).to.equal(item2.objB);
            done();
        });
        it('Test hierarchy injection', function (done) {
            var item, item2, di;
            Moa.define('typeA', {
                $di: {
                    $current: {
                        instance: 'item',
                        lifestyle: 'transient'
                    }
                }
            });
            Moa.define('typeB', {
                $di: {
                    $current: {
                        lifestyle: 'singleton'
                    }
                }
            });
            Moa.define('typeC', {
                $ctor: function (config) {
                    this.objA = config.objA;
                },
                $di: {
                    $current: {
                        instance: 'item',
                        lifestyle: 'transient'
                    },
                    $ctor: {
                        objA: 'typeA'
                    },
                    objB: 'typeB'
                }
            });
            Moa.define('typeD', {
                $di: {
                    $current: {
                        instance: 'item',
                        lifestyle: 'singleton'
                    },
                    objA: {
                        type: 'typeA',
                        lifestyle: 'singleton'
                    },
                    objB: 'typeB'
                }
            });
            Moa.define('typeE', {
                $di: {
                    $current: {
                        instance: 'item',
                        lifestyle: 'transient'
                    },
                    objA: 'typeA',
                    objB: 'typeB',
                    objC: 'typeC',
                    objD: 'typeD'
                }
            });

            di = Moa.getTypeInfo('typeA').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'typeA',
                    instance: 'item',
                    lifestyle: 'transient'
                }
            });
            di = Moa.getTypeInfo('typeB').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'typeB',
                    instance: 'item',
                    lifestyle: 'singleton'
                }
            });
            di = Moa.getTypeInfo('typeC').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'typeC',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                $ctor: {
                    objA: {
                        type: 'typeA',
                        instance: 'item',
                        lifestyle: 'transient'
                    }
                },
                $prop: {
                    objB: {
                        type: 'typeB',
                        instance: 'item',
                        lifestyle: 'singleton'
                    }
                }
            });
            di = Moa.getTypeInfo('typeD').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'typeD',
                    instance: 'item',
                    lifestyle: 'singleton'
                },
                $prop: {
                    objA: {
                        type: 'typeA',
                        instance: 'item',
                        lifestyle: 'singleton'
                    },
                    objB: {
                        type: 'typeB',
                        instance: 'item',
                        lifestyle: 'singleton'
                    }
                }
            });
            di = Moa.getTypeInfo('typeE').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'typeE',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                $prop: {
                    objA: {
                        type: 'typeA',
                        instance: 'item',
                        lifestyle: 'transient'
                    },
                    objB: {
                        type: 'typeB',
                        instance: 'item',
                        lifestyle: 'singleton'
                    },
                    objC: {
                        type: 'typeC',
                        instance: 'item',
                        lifestyle: 'transient'
                    },
                    objD: {
                        type: 'typeD',
                        instance: 'item',
                        lifestyle: 'singleton'
                    }
                }
            });
            item = Moa.resolve('typeE');
            item2 = Moa.resolve('typeE');
            expect(item).to.not.equal(item2);
            expect(item).to.deep.equal(item2);
            expect(item.objB).to.equal(item2.objB);
            expect(item.objD).to.equal(item2.objD);
            expect(item.objD.objA).to.equal(item2.objD.objA);
            expect(item.objD.objB).to.equal(item2.objD.objB);
            done();
        });
        it('Test wrong di configuration', function (done) {
            var di;
            Moa.define('typeA', {});
            Moa.define('typeB', {
                $di: {
                    a: {
                        type: 'typeA',
                        instance: 'notItem'
                    }
                }
            });
            Moa.define('typeC', {
                $di: {
                    a: {
                        type: 'typeA',
                        lifestyle: 'infinitely'
                    }
                }
            });
            di = Moa.getTypeInfo('typeB').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'typeB',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                $prop: {
                    a: {
                        type: 'typeA',
                        instance: 'notItem',
                        lifestyle: 'transient'
                    }
                }
            });
            di = Moa.getTypeInfo('typeC').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'typeC',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                $prop: {
                    a: {
                        type: 'typeA',
                        instance: 'item',
                        lifestyle: 'infinitely'
                    }
                }
            });
            expect(function () {
                Moa.resolve('typeB');
            }).to.throw('Wrong parameter typeB::$di::$current::instance in resolve');
            expect(function () {
                Moa.resolve('typeC');
            }).to.throw('Wrong parameter typeC::$di::$current::lifestyle in resolve');
            expect(function () {
                Moa.resolve('typeABC');
            }).to.throw('Type typeABC not found');
            done();
        });
        it('Test $proto injection', function (done) {
            var item, item2, Ctor, di;
            Moa.define('typeA', {});
            Moa.define('bigType', null);
            Moa.define('bigType', {
                $di: {
                    $proto: {
                        propTypeA: 'typeA',
                        ctorTypeA: {
                            type: 'typeA',
                            instance: 'ctor'
                        }
                    }
                },
                getItem: function () {
                    return this.propTypeA;
                },
                getCtor: function () {
                    return this.ctorTypeA;
                }
            });
            di = Moa.getTypeInfo('bigType').$di;
            expect(di).to.deep.equal({
                $current: {
                    type: 'bigType',
                    instance: 'item',
                    lifestyle: 'transient'
                },
                $proto: {
                    propTypeA: {
                        type: 'typeA',
                        instance: 'item',
                        lifestyle: 'singleton'
                    },
                    ctorTypeA: {
                        type: 'typeA',
                        instance: 'ctor'
                    }
                }
            });
            Ctor = Moa.define('typeA');
            item = Moa.resolve('bigType');
            item2 = Moa.resolve('bigType');
            expect(item.getCtor()).to.equal(Ctor);
            expect(item.getCtor()).to.equal(item2.getCtor());
            expect(item.getItem()).to.equal(item2.getItem());
            done();
        });
    });
    describe('Test Moa Di for benchmarks', function () {
        it('Test property implementation', function (done) {
            var iManual, iIoc,
                item = {
                    manualProperty: function () {
                        var CtorA = Moa.define('typeA'),
                            CtorB = Moa.define('typeB.2'),
                            CtorC = Moa.define('typeC'),
                            Ctor = Moa.define('Type'),
                            itemType = new Ctor();
                        itemType.a = new CtorA();
                        itemType.b = CtorB.getInstance();
                        itemType.c = CtorC;
                        return itemType;
                    },
                    iocProperty: function () {
                        return Moa.resolve('Type');
                    }
                };
            Moa.clear();

            Moa.define('typeA', {});
            Moa.define('typeB.1', {
                $di: {
                    $current: {
                        lifetime: 'singleton'
                    }
                }
            });
            Moa.define('typeB.2', {
                $single: true
            });
            Moa.define('typeC', {
                $di: {
                    $current: {
                        instance: 'ctor'
                    }
                }
            });
            Moa.define('Type', {
                $di: {
                    a: 'typeA',
                    b: 'typeB.1',
                    c: 'typeC'
                }
            });
            iManual = item.manualProperty();
            iIoc = item.iocProperty();
            expect(iManual.a.getType()).to.equal(iIoc.a.getType());
            expect(iManual.b.getType()).to.equal('typeB.2');
            expect(iIoc.b.getType()).to.equal('typeB.1');
            expect(new iManual.c().getType()).to.equal(new iIoc.c().getType());
            done();
        });
    });
    describe('Test DI as independent component', function () {
        it('should register any external types', function (done) {
            var obj = { name: 'Name', age: 17 },
                fn = function () { return true; };
            Moa.register('ExtraTypeA', obj);
            Moa.register('ExtraTypeB', fn);
            expect(Moa.resolve('ExtraTypeA')).to.equal(obj);
            expect(Moa.resolve('ExtraTypeB')).to.equal(fn);
            done();
        });
    });
});
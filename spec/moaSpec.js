/**
 * Created with WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 10/31/13
 * Time: 6:11 PM
 */
/*global define:true, describe:true, it:true*/
define(['moa', 'tool', 'chai'], function (Moa, tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test "Moa" implementation', function () {
        it('Define simple object', function (done) {
            var Ctor, item;
            expect(function () {
                Moa.define();
            }).to.throw('Wrong parameters in define');
            expect(function () {
                Moa.define('type', {}, 1);
            }).to.throw('Wrong parameters in define');
            expect(function () {
                Moa.define('type', 1);
            }).to.throw('Wrong parameter definition in define');
            expect(function () {
                Moa.define('type', 'object');
            }).to.throw('Wrong parameter definition in define');
            Ctor = Moa.define('obj', {});
            item = new Ctor();
            expect(Ctor).to.be.a('function');
            expect(item).to.be.a('object');
            expect(Ctor.prototype).to.have.ownProperty('getType');
            expect(item.getType()).to.equal('obj');
            Ctor = Moa.define('obj', null);
            expect(Ctor).to.be.a('undefined');
            done();
        });
        it('Test $extend object', function (done) {
            var Ctor, item,
                base = {
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
                };
            Moa.define('base', base);
            Ctor = Moa.define('child', child);
            item = new Ctor();
            expect(Ctor).to.be.a('function');
            expect(Ctor.prototype).to.have.ownProperty('extraMethod');
            expect(Ctor.prototype).to.have.ownProperty('getConst');
            expect(Ctor.prototype).to.not.have.ownProperty('getTestProp');
            expect(Ctor).to.not.have.ownProperty('getTestProp');
            expect(Ctor.prototype).to.have.ownProperty('testProp');
            expect(item).to.not.have.ownProperty('$extend');
            expect(Ctor.prototype).to.not.have.ownProperty('$extend');
            expect(item.testProp).to.equal('Child name');
            expect(item.getTestProp()).to.equal('Child name');
            expect(item.extraMethod()).to.equal('Extra:Child name');
            expect(item.getConst()).to.equal(5);
            expect(item.getType()).to.equal('child');
            done();
        });
        it('Extend wrong type', function (done) {
            Moa.define('base', {});
            expect(function () {
                Moa.define('child', {
                    $extend: 'base'
                });
            }).to.not.throw('Type base not found');
            expect(function () {
                Moa.define('child', {
                    $extend: 'base-base'
                });
            }).to.throw('Type base-base not found');
            expect(function () {
                Moa.define('child', function ($base) {
                    return {
                        $extend: 'base-base'
                    };
                });
            }).to.throw('Type base-base not found');
            expect(
                function () {
                    Moa.define('child', function ($base) {
                        return {};
                    });
                }
            ).to.not.throw('Wrong parameter $extend in definition');
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
            constructorFn = Moa.define('simpleClass', simpleObj);
            constructor2 = Moa.define('simpleClass');
            expect(constructorFn === constructor2).to.equal(true);
            expect(function () {
                Moa.define('wrongClass');
            }).to.throw('Type wrongClass not found');
            done();
        });
        it('Using constructor', function (done) {
            var BaseCtor, item, item2,
                base = {
                    $ctor: function (name) {
                        this.name = name;
                    },
                    getName: function () {
                        return this.name;
                    },
                    setName: function (v) {
                        this.name = v;
                    }
                };
            BaseCtor = Moa.define('base', base);
            item = new BaseCtor('Nexus');
            item2 = new BaseCtor('Note');
            expect(BaseCtor.prototype).to.have.ownProperty('getName');
            expect(BaseCtor.prototype).to.have.ownProperty('setName');
            expect(BaseCtor.prototype).to.not.have.ownProperty('name');
            expect(item).to.have.ownProperty('name');
            expect(item.name).to.equal('Nexus');
            expect(item2.name).to.equal('Note');
            item.setName('Nexus 5');
            expect(item.name).to.equal('Nexus 5');
            expect(item.getName()).to.equal('Nexus 5');
            done();
        });
        it('Apply base constructor', function (done) {
            var Ctor, item, item2,
                base = {
                    $ctor: function (name) {
                        this.name = name;
                    },
                    getName: function () {
                        return this.name;
                    }
                },
                child = function ($base) {
                    return {
                        $extend: 'base',
                        $ctor: function (name, age) {
                            this.age = age;
                            $base.$ctor.call(this, name);
                        },
                        getAge: function () {
                            return this.age;
                        }
                    };
                },
                subchild = function ($base) {
                    return {
                        $extend: 'child',
                        $ctor: function (name, age, weight) {
                            this.weight = weight;
                            $base.$ctor.call(this, name, age);
                        },
                        getWeight: function () {
                            return this.weight;
                        }
                    };
                },
                sub2child = function ($base) {
                    return {
                        $extend: 'subchild',
                        $ctor: function (name, age, weight, height) {
                            this.height = height;
                            $base.$ctor.call(this, name, age, weight);
                        },
                        getHeight: function () {
                            return this.height;
                        }
                    };
                },
                sub3child = function ($base) {
                    return {
                        $extend: 'sub2child',
                        $ctor: function (name, age, weight, height, color) {
                            this.color = color;
                            $base.$ctor.call(this, name, age, weight, height);
                        },
                        getColor: function () {
                            return this.color;
                        }
                    };
                };
            Moa.define('base', base);
            Moa.define('child', child);
            Moa.define('subchild', subchild);
            Moa.define('sub2child', sub2child);
            Moa.define('sub3child', sub3child);
            Ctor = Moa.define('sub3child');
            item = new Ctor('Nexus', 5, 0.1, '5 inch', 'white');
            item2 = new Ctor('Note', 3, 0.15, '6 inch', 'black');
            expect(item).to.have.ownProperty('name');
            expect(item).to.have.ownProperty('age');
            expect(item).to.have.ownProperty('weight');
            expect(item).to.have.ownProperty('height');
            expect(item).to.have.ownProperty('color');
            expect(item.name).to.equal('Nexus');
            expect(item.getName()).to.equal('Nexus');
            expect(item.age).to.equal(5);
            expect(item.getAge()).to.equal(5);
            expect(item.weight).to.equal(0.1);
            expect(item.getWeight()).to.equal(0.1);
            expect(item.height).to.equal('5 inch');
            expect(item.getHeight()).to.equal('5 inch');
            expect(item.color).to.equal('white');
            expect(item.getColor()).to.equal('white');

            expect(item2.getName()).to.equal('Note');
            expect(item2.getAge()).to.equal(3);
            expect(item2.getWeight()).to.equal(0.15);
            expect(item2.getHeight()).to.equal('6 inch');
            expect(item2.getColor()).to.equal('black');
            done();
        });
        it('Run base method implementation', function (done) {
            var Ctor, item,
                base = {
                    $ctor: function (name) {
                        this.name = name;
                    },
                    getName: function () {
                        return this.name;
                    }
                },
                child = function ($base) {
                    return {
                        $extend: 'base',
                        $ctor: function (name) {
                            $base.$ctor.call(this, name);
                        },
                        getName: function () {
                            var baseName;
                            baseName = $base.getName.call(this);
                            return 'Child::' + baseName;
                        }
                    };
                },
                subchild = function ($base) {
                    return {
                        $extend: 'child',
                        $ctor: function (name) {
                            $base.$ctor.call(this, name);
                        },
                        getName: function () {
                            var baseName;
                            baseName = $base.getName.call(this);
                            return 'Sub::' + baseName;
                        }
                    };
                };
            Moa.define('base', base);
            Moa.define('child', child);
            Ctor = Moa.define('subchild', subchild);
            item = new Ctor('Nexus');
            expect(item).to.have.ownProperty('name');
            expect(item.name).to.equal('Nexus');
            expect(item.getName()).to.equal('Sub::Child::Nexus');
            done();
        });
        it('Create base constructor with function', function (done) {
            var Ctor, item, baseObj,
                base = function ($base) {
                    return {
                        $ctor: function () {
                            // $base is undefined
                            //$base.$ctor.call(this);
                        },
                        getBase: function () {
                            return $base;
                        }
                    };
                },
                child = function ($base) {
                    return {
                        $extend: 'base',
                        $ctor: function () {
                            $base.$ctor.call(this);
                        },
                        getBase: function () {
                            return $base;
                        }
                    };
                };
            Moa.define('base', base);
            Moa.define('child', child);
            Ctor = Moa.define('base');
            item = new Ctor();
            baseObj = item.getBase();
            expect(item.getType()).to.equal('base');
            expect(baseObj).to.be.undefined;
            Ctor = Moa.define('child');
            item = new Ctor();
            baseObj = item.getBase();
            expect(item.getType()).to.equal('child');
            expect(baseObj.getType()).to.equal('base');
            done();
        });
        it('Test $static implementation', function (done) {
            var base = {
                    $ctor: function (name) {
                        this.name = name;
                    },
                    getName: function () {
                        return this.name;
                    },
                    $static: {
                        getMsg: function () {
                            return 'Static!';
                        },
                        staticProp: 'Common'
                    }
                },
                Ctor;
            Ctor = Moa.define('base', base);
            expect(Ctor).to.have.ownProperty('getMsg');
            expect(Ctor).to.have.ownProperty('staticProp');
            expect(Ctor.getMsg()).to.equal('Static!');
            expect(Ctor.staticProp).to.equal('Common');
            done();
        });
        it('Test singleton implementation', function (done) {
            var base = {
                    $ctor: function () {
                        this.name = 'Moa';
                    },
                    getName: function () {
                        return this.name;
                    },
                    $single: true
                },
                Ctor,
                ctor,
                item;
            Ctor = Moa.define('base', base);
            ctor = Ctor;
            item = new Ctor();
            expect(item.getName()).to.equal('Moa');
            expect(new Ctor()).to.equal(item);
            expect(ctor()).to.equal(item);
            expect(Ctor.getInstance()).to.equal(item);
            done();
        });
        it('Test base $mixin implementation', function (done) {
            var base = {
                    $ctor: function (a, b) {
                        this.a = a;
                        this.b = b;
                    },
                    $mixin: {
                        nummix: 'numMix'
                    },
                    mul: function () {
                        return 'a*b=' + this.nummix.mul.call(this);
                    }
                },
                numMix = function () {
                    this.add = function () {
                        return (this.a + this.b);
                    };
                    this.sub = function () {
                        return (this.a - this.b);
                    };
                    this.mul = function () {
                        return (this.a * this.b);
                    };
                },
                Ctor,
                item;
            Moa.mixin('numMix', numMix);
            Ctor = Moa.define('base', base);
            item = new Ctor(3, 4);
            expect(Ctor.prototype).to.have.ownProperty('add');
            expect(Ctor.prototype).to.have.ownProperty('sub');
            expect(Ctor.prototype).to.have.ownProperty('mul');
            expect(item.add()).to.equal(7);
            expect(item.sub()).to.equal(-1);
            expect(item.mul()).to.equal('a*b=12');
            done();
        });
        it('Test multiple $mixin implementation', function (done) {
            var base = {
                    $ctor: function (a, b) {
                        this.a = a;
                        this.b = b;
                    },
                    $mixin: {
                        num: 'numMix',
                        str: 'strMix'
                    }
                },
                numMix = function () {
                    this.add = function () {
                        return (this.a + this.b);
                    };
                },
                strMix = function () {
                    this.add = function () {
                        return (this.a.toString() + this.b.toString());
                    };
                },
                Ctor,
                item;
            Moa.mixin('numMix', numMix);
            Moa.mixin('strMix', strMix);
            Ctor = Moa.define('base', base);
            item = new Ctor(10, 12);
            expect(item.add()).to.equal('1012');
            expect(item.num.add.call(item)).to.equal(22);
            expect(item.str.add.call(item)).to.equal('1012');
            done();
        });
        it('Test errors in mixins', function (done) {
            var base = {
                    $mixin: {
                        nummix: 'numMixA'
                    }
                },
                numMix = function () {
                    this.add = function () {
                        return (this.a + this.b);
                    };
                };
            Moa.mixin('numMix', numMix);
            expect(function () {
                Moa.mixin('mix', {});
            }).to.throw('Wrong parameter definition in mixin');
            expect(function () {
                Moa.define('base', base);
            }).to.throw('Mixin type numMixA not found');
            done();
        });
        it('Test $static mixins implementation', function (done) {
            var base = {
                    $ctor: function (a, b) {
                        this.a = a;
                        this.b = b;
                    },
                    $mixin: {
                        num: 'numMix'
                    },
                    $static: {
                        $mixin: {
                            str: 'strMix'
                        },
                        a: 11,
                        b: 22
                    }
                },
                numMix = function () {
                    this.add = function () {
                        return (this.a + this.b);
                    };
                },
                strMix = function () {
                    this.add = function () {
                        return (this.a.toString() + this.b.toString());
                    };
                },
                Ctor,
                item;
            Moa.mixin('numMix', numMix);
            Moa.mixin('strMix', strMix);
            Ctor = Moa.define('base', base);
            item = new Ctor(10, 12);
            expect(item.add()).to.equal(22);
            expect(Ctor.add()).to.equal('1122');
            expect(Ctor.str.add.call(Ctor)).to.equal('1122');
            done();
        });
    });
});
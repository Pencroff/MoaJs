/**
 * Created with WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 10/31/13
 * Time: 6:11 PM
 */
/*global define:true, describe:true, it:true*/
define(['moa', 'tool', 'chai'], function (moa, tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test "Moa" implementation', function () {
        it('Define simple object', function (done) {
            var Ctor, item;
            expect(function () {moa.define()}).to.throw('Wrong parameters in define');
            expect(function () {moa.define('type', {}, 1)}).to.throw('Wrong parameters in define');
            expect(function () {moa.define('type', 1)}).to.throw('Wrong parameter definition in define');
            expect(function () {moa.define('type', 'object')}).to.throw('Wrong parameter definition in define');
            Ctor = moa.define('obj', {});
            item = new Ctor();
            expect(Ctor).to.be.a('function');
            expect(item).to.be.a('object');
            expect(Ctor.prototype).to.have.ownProperty('getType');
            expect(item.getType()).to.equal('obj');
            Ctor = moa.define('obj', null);
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
            moa.define('base', base);
            Ctor = moa.define('child', child);
            item =  new Ctor();
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
            moa.define('base', {});
            expect(
                function () {
                    moa.define('child', {
                        $extend: 'base'
                    });
                }
            ).to.not.throw('Type base not found');
            expect(
                function () {
                    moa.define('child', {
                        $extend: 'base-base'
                    });
                }
            ).to.throw('Type base-base not found');
            expect(
                function () {
                    moa.define('child', function ($base) {
                        return {
                            $extend: 'base-base'
                        };
                    });
                }
            ).to.throw('Type base-base not found');
            expect(
                function () {
                    moa.define('child', function ($base) {
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
            constructorFn = moa.define('simpleClass', simpleObj);
            constructor2 = moa.define('simpleClass');
            expect(constructorFn === constructor2).to.true;
            expect(function () {moa.define('wrongClass')}).to.throw('Type wrongClass not found');
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
            BaseCtor = moa.define('base', base);
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
            moa.define('base', base);
            moa.define('child', child);
            moa.define('subchild', subchild);
            moa.define('sub2child', sub2child);
            moa.define('sub3child', sub3child);
            Ctor = moa.define('sub3child');
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
            moa.define('base', base);
            moa.define('child', child);
            Ctor = moa.define('subchild', subchild);
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
            moa.define('base', base);
            moa.define('child', child);
            Ctor = moa.define('base');
            item = new Ctor();
            baseObj = item.getBase();
            expect(item.getType()).to.equal('base');
            expect(baseObj).to.be.undefined;
            Ctor = moa.define('child');
            item = new Ctor();
            baseObj = item.getBase();
            expect(item.getType()).to.equal('child');
            expect(baseObj.getType()).to.equal('base');
            done();
        });
    });
});
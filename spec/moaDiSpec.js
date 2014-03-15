/**
 * Created by Pencroff on 13.03.14.
 */
/*global define:true, describe:true, it:true*/
define(['Moa', 'tool', 'chai'], function (Moa, tool, chai) {
    'use strict';
    var expect = chai.expect;
    describe('Test Moa Di implementation', function () {
        it('Test simple property injection', function (done) {
            var item;
            Moa.define('typeA', {});
            Moa.define('typeB', {});
            Moa.define('bigType', {
                $di: {
                    a: 'typeA',
                    b: 'typeB',
                    c: 'str',
                    d: 3214,
                    e: false
                }
            });
            item = Moa.resolve('bigType');
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
                Moa.resolve('bigType', {}, true);
            }).to.throw('Wrong parameters in resolve');

            done();
        });
        it('Test ctor injection', function (done) {
            var item;
            Moa.define('typeA', {});
            Moa.define('typeB', {});
            Moa.define('bigType', {
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
            item = Moa.resolve('bigType', {
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
            done();
        });
    });
});
/**
 * Created with WebStorm.
 * Project: GeneticJs
 * User: Sergii Danilov
 * Date: 11/18/13
 * Time: 12:08 PM
 */
/*global define:true, describe:true, it:true*/
define(['Moa', 'chai', 'mixinsSrc/MixSearch'], function (Moa, chai, mix) {
    'use strict';
    var expect = chai.expect;
    describe('Test Algorithm Mixin', function () {
        it('Init mixin for tests', function (done) {
            Moa.mixin('mixSearch', mix);
            done();
        });
        it('Test Algorithm Mixin', function (done) {
            var base = {
                    $mixin: {
                        algorithm: 'mixSearch'
                    }
                },
                Ctor;
            Ctor = Moa.define('base', base);
            expect(Ctor.prototype).to.have.ownProperty('algorithm');
            expect(Ctor.prototype).to.have.ownProperty('linearSearch');
            expect(Ctor.prototype).to.have.ownProperty('binarySearch');
            done();
        });
        it('Test Linear Search', function (done) {
            var base = {
                    $mixin: {
                        algorithm: 'mixSearch'
                    }
                },
                emptyArray = [],
                testArray = [5, 7, 9, 15, 18, 21, 29, 36, 45, 57],
                testLiteral = {'0': 5, '1': 7, '2': 9, '3': 15, '4': 18, '5': 21, '6': 29, '7': 36, '8': 45, '9': 57},
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            expect(item.linearSearch(36, emptyArray, 0)).to.equal(-1);

            expect(item.linearSearch(36, testArray, 10)).to.equal(7);
            expect(item.linearSearch(5, testArray, 10)).to.equal(0);
            expect(item.linearSearch(57, testArray, 10)).to.equal(9);
            expect(item.linearSearch(2, testArray, 10)).to.equal(-1);
            expect(item.linearSearch(75, testArray, 10)).to.equal(-1);

            expect(item.linearSearch(36, testLiteral, 10)).to.equal(7);
            expect(item.linearSearch(5, testLiteral, 10)).to.equal(0);
            expect(item.linearSearch(57, testLiteral, 10)).to.equal(9);
            expect(item.linearSearch(2, testLiteral, 10)).to.equal(-1);
            expect(item.linearSearch(75, testLiteral, 10)).to.equal(-1);
            done();
        });
        it('Test Linear Search Less', function (done) {
            var base = {
                    $mixin: {
                        algorithm: 'mixSearch'
                    }
                },
                emptyArray = [],
                testArray = [5, 7, 9, 15, 18, 21, 29, 36, 45, 57],
//                           0  1  2   3   4   5   6   7   8   9
                testLiteral = {'0': 5, '1': 7, '2': 9, '3': 15, '4': 18, '5': 21, '6': 29, '7': 36, '8': 45, '9': 57},
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            expect(item.linearSearchLess(35, emptyArray, 0)).to.equal(-1);

            expect(item.linearSearchLess(35, testArray, 10)).to.equal(6);
            expect(item.linearSearchLess(36, testArray, 10)).to.equal(6);
            expect(item.linearSearchLess(37, testArray, 10)).to.equal(7);
            expect(item.linearSearchLess(2, testArray, 10)).to.equal(-1);
            expect(item.linearSearchLess(5, testArray, 10)).to.equal(-1);
            expect(item.linearSearchLess(6, testArray, 10)).to.equal(0);
            expect(item.linearSearchLess(56, testArray, 10)).to.equal(8);
            expect(item.linearSearchLess(57, testArray, 10)).to.equal(8);
            expect(item.linearSearchLess(75, testArray, 10)).to.equal(9);

            expect(item.linearSearchLess(35, testLiteral, 10)).to.equal(6);
            expect(item.linearSearchLess(36, testLiteral, 10)).to.equal(6);
            expect(item.linearSearchLess(37, testLiteral, 10)).to.equal(7);
            expect(item.linearSearchLess(2, testLiteral, 10)).to.equal(-1);
            expect(item.linearSearchLess(5, testLiteral, 10)).to.equal(-1);
            expect(item.linearSearchLess(6, testLiteral, 10)).to.equal(0);
            expect(item.linearSearchLess(56, testLiteral, 10)).to.equal(8);
            expect(item.linearSearchLess(57, testLiteral, 10)).to.equal(8);
            expect(item.linearSearchLess(75, testLiteral, 10)).to.equal(9);

            done();
        });
        it('Test Linear Search Greater', function (done) {
            var base = {
                    $mixin: {
                        algorithm: 'mixSearch'
                    }
                },
                emptyArray = [],
                testArray = [5, 7, 9, 15, 18, 21, 29, 36, 45, 57],
//                           0  1  2   3   4   5   6   7   8   9
                testLiteral = {'0': 5, '1': 7, '2': 9, '3': 15, '4': 18, '5': 21, '6': 29, '7': 36, '8': 45, '9': 57},
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            expect(item.linearSearchGreater(35, emptyArray, 0)).to.equal(-1);

            expect(item.linearSearchGreater(35, testArray, 10)).to.equal(7);
            expect(item.linearSearchGreater(36, testArray, 10)).to.equal(8);
            expect(item.linearSearchGreater(37, testArray, 10)).to.equal(8);
            expect(item.linearSearchGreater(2, testArray, 10)).to.equal(0);
            expect(item.linearSearchGreater(5, testArray, 10)).to.equal(1);
            expect(item.linearSearchGreater(6, testArray, 10)).to.equal(1);
            expect(item.linearSearchGreater(56, testArray, 10)).to.equal(9);
            expect(item.linearSearchGreater(57, testArray, 10)).to.equal(-1);
            expect(item.linearSearchGreater(75, testArray, 10)).to.equal(-1);

            expect(item.linearSearchGreater(35, testLiteral, 10)).to.equal(7);
            expect(item.linearSearchGreater(36, testLiteral, 10)).to.equal(8);
            expect(item.linearSearchGreater(37, testLiteral, 10)).to.equal(8);
            expect(item.linearSearchGreater(2, testLiteral, 10)).to.equal(0);
            expect(item.linearSearchGreater(5, testLiteral, 10)).to.equal(1);
            expect(item.linearSearchGreater(6, testLiteral, 10)).to.equal(1);
            expect(item.linearSearchGreater(56, testLiteral, 10)).to.equal(9);
            expect(item.linearSearchGreater(57, testLiteral, 10)).to.equal(-1);
            expect(item.linearSearchGreater(75, testLiteral, 10)).to.equal(-1);

            done();
        });
        it('Test Binary Search', function (done) {
            var base = {
                    $mixin: {
                        algorithm: 'mixSearch'
                    }
                },
                emptyArray = [],
                testArray = [5, 7, 9, 15, 18, 21, 29, 36, 45, 57],
                testLiteral = {'0': 5, '1': 7, '2': 9, '3': 15, '4': 18, '5': 21, '6': 29, '7': 36, '8': 45, '9': 57},
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            expect(item.binarySearch(36, emptyArray, 0)).to.equal(-1);

            expect(item.binarySearch(36, testArray, 10)).to.equal(7);
            expect(item.binarySearch(5, testArray, 10)).to.equal(0);
            expect(item.binarySearch(57, testArray, 10)).to.equal(9);
            expect(item.binarySearch(2, testArray, 10)).to.equal(-1);
            expect(item.binarySearch(75, testArray, 10)).to.equal(-1);

            expect(item.binarySearch(36, testLiteral, 10)).to.equal(7);
            expect(item.binarySearch(5, testLiteral, 10)).to.equal(0);
            expect(item.binarySearch(57, testLiteral, 10)).to.equal(9);
            expect(item.binarySearch(2, testLiteral, 10)).to.equal(-1);
            expect(item.binarySearch(75, testLiteral, 10)).to.equal(-1);
            done();
        });
        it('Test Binary Search Greater', function (done) {
            var base = {
                    $mixin: {
                        algorithm: 'mixSearch'
                    }
                },
                emptyArray = [],
                testArray = [5, 7, 9, 15, 18, 21, 29, 36, 45, 57],
//                           0  1  2   3   4   5   6   7   8   9
                testLiteral = {'0': 5, '1': 7, '2': 9, '3': 15, '4': 18, '5': 21, '6': 29, '7': 36, '8': 45, '9': 57},
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            expect(item.binarySearchGreater(35, emptyArray, 0)).to.equal(-1);

            expect(item.binarySearchGreater(35, testArray, 10)).to.equal(7);
            expect(item.binarySearchGreater(36, testArray, 10)).to.equal(8);
            expect(item.binarySearchGreater(37, testArray, 10)).to.equal(8);
            expect(item.binarySearchGreater(2, testArray, 10)).to.equal(0);
            expect(item.binarySearchGreater(5, testArray, 10)).to.equal(1);
            expect(item.binarySearchGreater(6, testArray, 10)).to.equal(1);
            expect(item.binarySearchGreater(56, testArray, 10)).to.equal(9);
            expect(item.binarySearchGreater(57, testArray, 10)).to.equal(-1);
            expect(item.binarySearchGreater(75, testArray, 10)).to.equal(-1);

            expect(item.binarySearchGreater(35, testLiteral, 10)).to.equal(7);
            expect(item.binarySearchGreater(36, testLiteral, 10)).to.equal(8);
            expect(item.binarySearchGreater(37, testLiteral, 10)).to.equal(8);
            expect(item.binarySearchGreater(2, testLiteral, 10)).to.equal(0);
            expect(item.binarySearchGreater(5, testLiteral, 10)).to.equal(1);
            expect(item.binarySearchGreater(6, testLiteral, 10)).to.equal(1);
            expect(item.binarySearchGreater(56, testLiteral, 10)).to.equal(9);
            expect(item.binarySearchGreater(57, testLiteral, 10)).to.equal(-1);
            expect(item.binarySearchGreater(75, testLiteral, 10)).to.equal(-1);

            done();
        });
    });
});
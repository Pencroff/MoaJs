/**
 * Created by Pencroff on 08.12.13.
 */
/*global define:true, describe:true, it:true*/
define(['Moa', 'chai', 'mixinsSrc/MixSort'], function (Moa, chai, mix) {
    'use strict';
    var expect = chai.expect;
    describe('Test Sort Mixin', function () {
        var expectArraySort = function (a) {
                var len, i;
                len = a.length;
                for (i = 1; i < len; i += 1) {
                    expect(a[i] >= a[i - 1]).to.equal(true);
                }
            },
            compare = function (a, b) {
                return a - b;
            };
        it('Init mixin for tests', function (done) {
            Moa.mixin('mixSort', mix);
            done();
        });
        it('Test Swap array elements', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                testArray = [5, 7, 9, 15, 18, 21, 29, 36, 45, 57],
                testLiteral = {'0': 5, '1': 7, '2': 9, '3': 15, '4': 18, '5': 21, '6': 29, '7': 36, '8': 45, '9': 57},
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            item.swap(testArray, 0, 2);
            expect(testArray[0]).to.equal(9);
            expect(testArray[2]).to.equal(5);
            item.swap(testLiteral, 0, 2);
            expect(testLiteral[0]).to.equal(9);
            expect(testLiteral[2]).to.equal(5);
            done();
        });
        it('Test quick sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            item.qsort(arr, compare);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.qsort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test comb sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            item.combSort(arr, compare);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.combSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test gnome sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
//            console.log();
//            console.log(arr);
            item.gnomeSort(arr, compare);
//            console.log(arr);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.gnomeSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test shaker sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
//            console.log();
//            console.log(arr);
            item.shakerSort(arr, compare);
//            console.log(arr);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.shakerSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test insert sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
//            console.log();
//            console.log(arr);
            item.insertSort(arr, compare);
//            console.log(arr);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.insertSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test binary insertion sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
//            console.log();
//            console.log(arr);
            item.binInsertSort(arr, compare);
//            console.log(arr);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.binInsertSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test merge sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
//            console.log();
//            console.log(arr);
            item.mergeSort(arr, compare);
//            console.log(arr);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.mergeSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test one merge sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                arr2 = [6, 5, 3, 1, 8, 7, 2, 4],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            //console.log();
            //console.log(arr);
            item.oneMergeSort(arr, compare);
            //console.log(arr);
            expectArraySort(arr);

            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.oneMergeSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test selection sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
//            console.log();
//            console.log(arr);
            item.selectionSort(arr, compare);
//            console.log(arr);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.selectionSort(arr, compare);
            expectArraySort(arr);
            done();
        });
        it('Test hybrid merge sort', function (done) {
            var base = {
                    $mixin: {
                        sort: 'mixSort'
                    }
                },
                arr = [5, 9, 7, 19, 14, 27, 22, 38, 31, 3],
                Ctor,
                item,
                big = 500,
                i;
            Ctor = Moa.define('base', base);
            item = new Ctor();
//            console.log();
//            console.log(arr);
            item.hybridMergeSort(arr, compare);
//            console.log(arr);
            expectArraySort(arr);
            arr.length = big;
            for (i = 0; i < big; i += 1) {
                arr[i] = (Math.random() * big) >> 0;
            }
            item.hybridMergeSort(arr, compare);
            expectArraySort(arr);
            done();
        });
    });
});
/**
 * Created by Pencroff on 08.12.13.
 */
/*global define:true*/
define('mixinsSrc/MixSort', ['Moa'], function (Moa) {
    "use strict";
    var undef,
        mix = function () {
            this.sortBy = function (field, reverse, transformation) {
                // Now you can sort by any field at will...
                 /*var homes = [{
                 "h_id": "3",
                 "city": "Dallas",
                 "state": "TX",
                 "zip": "75201",
                 "price": "162500"
                 }, {
                 "h_id": "4",
                 "city": "Bevery Hills",
                 "state": "CA",
                 "zip": "90210",
                 "price": "319250"
                 }, {
                 "h_id": "5",
                 "city": "New York",
                 "state": "NY",
                 "zip": "00010",
                 "price": "962500"
                 }];*/
                 // Sort by price high to low
                 // homes.sort(sort_by('price', true, parseInt));
                 // Sort by city, case-insensitive, A-Z
                 // homes.sort(sort_by('city', false, function(a){return a.toUpperCase()}));
                var key = transformation ? function (x) {
                    return transformation(x[field]);
                } : function (x) {
                    return x[field];
                };
                reverse = [-1, 1][+!!reverse];
                return function (a, b) {
                    a = key(a);
                    b = key(b);
                    return reverse * ((a > b) - (b > a));
                };
            };
            this.swap = function (colection, first, last) {
                var temp = colection[first];
                colection[first] = colection[last];
                colection[last] = temp;
            };
            this.qsort = function (colection, fnCompare) {
                var swap = this.swap,
                    sort = function (colection, first, last) {
                        var iFirst = first,
                            iLast = last,
                            iPivot = first + last >> 1,
                            pivot = colection[iPivot];
                        while (iFirst < iLast) {
                            while (fnCompare(pivot, colection[iFirst]) > 0) {  //pivot > colection[iFirst]
                                iFirst += 1;
                            }
                            while (fnCompare(colection[iLast], pivot) > 0) {  //colection[iLast] > pivot
                                iLast -= 1;
                            }
                            if (iFirst <= iLast) {
                                if (iFirst < iLast) {
                                    swap(colection, iFirst, iLast);
                                }
                                iFirst += 1;
                                iLast -= 1;
                            }
                        }
                        if (iFirst < last) {
                            sort(colection, iFirst, last);
                        }
                        if (first < iLast) {
                            sort(colection, first, iLast);
                        }
                    };
                sort(colection, 0, colection.length - 1);
                return colection;
            };
            this.combSort = function (colection, fnCompare) {
                var swap = this.swap,
                    size = colection.length,
                    gap = size,
                    swapped = false,
                    first,
                    last;
                while ((gap > 1) || swapped) {
                    if (gap > 1) {
                        gap = gap / 1.24733 >> 0;
                    }
                    first = 0;
                    swapped = false;
                    last = gap;
                    while (last < size) {
                        if (fnCompare(colection[first], colection[last]) > 0) {
                            swap(colection, first, last);
                            swapped = true;
                        }
                        first += 1;
                        last += 1;
                    }
                }
                return colection;
            };
            this.gnomeSort = function (colection, fnCompare) {
                var swap = this.swap,
                    first = 0,
                    second = 1,
                    last = 2,
                    size = colection.length;
                while (second < size) {
                    if (fnCompare(colection[first], colection[second]) > 0) {
                        swap(colection, first, second);
                        second = first;
                        first -= 1;
                        if (second === 0) {
                            second = last;
                            first = second - 1;
                            last += 1;
                        }
                    } else {
                        second = last;
                        first = second - 1;
                        last += 1;
                    }
                }
                return colection;
            };
            this.shakerSort = function (colection, fnCompare) {
                var swap = this.swap,
                    left,
                    right,
                    len = colection.length,
                    i,
                    prev;
                left = 0;
                right = len - 1;
                while (right > left) {
                    for (i = right; i >= left; i -= 1) {
                        prev = i - 1;
                        if (fnCompare(colection[prev], colection[i]) > 0) {
                            swap(colection, i, prev);
                        }
                    }
                    left = left + 1;
                    for (i = left; i <= right; i += 1) {
                        prev = i - 1;
                        if (fnCompare(colection[prev], colection[i]) > 0) {
                            swap(colection, i, prev);
                        }
                    }
                    right = right - 1;
                }
                return colection;
            };
            this.insertSort = function (colection, fnCompare) {
                var size = colection.length,
                    value,
                    i,
                    prev,
                    next;
                for (i = 1; i < size; i += 1) {
                    prev = i - 1;
                    next = i;
                    value = colection[i];
                    while (prev >= 0 && fnCompare(colection[prev], value) > 0) {
                        colection[next] = colection[prev];
                        next = prev;
                        prev -= 1;
                    }
                    colection[next] = value;
                }
                return colection;
            };
            this.binInsertSort = function (colection, fnCompare) {
                var start = 0,
                    size = colection.length,
                    binSearch = function (val, from, to, arr) {
                        var m;
                        while (from <= to) {
                            m = (from + to) >> 1;
                            if (fnCompare(val, arr[m]) >= 0) {
                                from = m + 1;
                            } else {
                                to = m - 1;
                            }
                        }
                        return from;
                    },
                    i,
                    next,
                    prev,
                    value,
                    index;
                for (i = start; i < size; i += 1) {
                    value = colection[i];
                    prev = i - 1;
                    next = i;
                    index = binSearch(value, start, prev, colection);
                    for (prev; prev >= index; prev -= 1) {
                        colection[next] = colection[prev];
                        next -= 1;
                    }
                    colection[index] = value;
                }
            };
            this.mergeSort = function (colection, fnCompare) {
                //https://github.com/mkoistinen/Array.mergeSort/blob/master/Array.mergeSort.js
                var len = colection.length,
                    index,
                    firstIndex,
                    secondIndex,
                    firstArr,
                    secondArr,
                    firstLen,
                    secondLen,
                    firstVal,
                    secondVal;
                if (len > 1) {
                    firstLen = Math.floor(len / 2);
                    secondLen = len - firstLen;
                    firstArr = colection.slice(0, firstLen);
                    secondArr = colection.slice(firstLen);

                    this.mergeSort(firstArr, fnCompare);
                    this.mergeSort(secondArr, fnCompare);

                    index = firstIndex = secondIndex = 0;
                    while (firstLen !== firstIndex && secondLen !== secondIndex) {
                        firstVal = firstArr[firstIndex];
                        secondVal = secondArr[secondIndex];
                        if (fnCompare(firstVal, secondVal) < 0) {
                            colection[index] = firstVal;
                            firstIndex += 1;
                        } else {
                            colection[index] = secondVal;
                            secondIndex += 1;
                        }
                        index += 1;
                    }
                    while (firstLen !== firstIndex) {
                        colection[index] = firstArr[firstIndex];
                        index += 1;
                        firstIndex += 1;
                    }
                    while (secondLen !== secondIndex) {
                        colection[index] = secondArr[secondIndex];
                        index += 1;
                        secondIndex += 1;
                    }
                }
                return colection;
            };
            this.hybridMergeSort = function (colection, fnCompare) {
                var len = colection.length,
                    index,
                    firstIndex,
                    secondIndex,
                    firstArr,
                    secondArr,
                    firstLen,
                    secondLen,
                    firstVal,
                    secondVal;
                if (len > 30) {
                    firstLen = Math.floor(len / 2);
                    secondLen = len - firstLen;
                    firstArr = colection.slice(0, firstLen);
                    secondArr = colection.slice(firstLen);

                    this.hybridMergeSort(firstArr, fnCompare);
                    this.hybridMergeSort(secondArr, fnCompare);

                    index = firstIndex = secondIndex = 0;
                    while (firstLen !== firstIndex && secondLen !== secondIndex) {
                        firstVal = firstArr[firstIndex];
                        secondVal = secondArr[secondIndex];
                        if (fnCompare(firstVal, secondVal) < 0) {
                            colection[index] = firstVal;
                            firstIndex += 1;
                        } else {
                            colection[index] = secondVal;
                            secondIndex += 1;
                        }
                        index += 1;
                    }
                    while (firstLen !== firstIndex) {
                        colection[index] = firstArr[firstIndex];
                        index += 1;
                        firstIndex += 1;
                    }
                    while (secondLen !== secondIndex) {
                        colection[index] = secondArr[secondIndex];
                        index += 1;
                        secondIndex += 1;
                    }
                } else {
                    this.insertSort(colection, fnCompare);
                }
                return colection;
            };
            this.oneMergeSort = function (collection, fnCompare) {
                var collectionLen = collection.length,
                    merge = function (collection, fnCompare, first, len) {
                        var firstIndex,
                            secondIndex,
                            firstArr,
                            firstLen,
                            secondLen,
                            firstVal,
                            secondVal;
                        if (len > 1) {
                            firstLen = Math.floor(len / 2);
                            secondLen = len - firstLen;
                            secondIndex = first + firstLen;
                            firstArr = collection.slice(first, secondIndex);
                            merge(firstArr, fnCompare, 0, firstLen);
                            merge(collection, fnCompare, secondIndex, secondLen);
                            firstIndex = 0;
                            secondLen += secondIndex;
                            while (firstLen !== firstIndex && secondLen !== secondIndex) {
                                firstVal = firstArr[firstIndex];
                                secondVal = collection[secondIndex];
                                if (fnCompare(firstVal, secondVal) < 0) {
                                    collection[first] = firstVal;
                                    firstIndex += 1;
                                } else {
                                    collection[first] = secondVal;
                                    secondIndex += 1;
                                }
                                first += 1;
                            }
                            while (firstLen !== firstIndex) {
                                collection[first] = firstArr[firstIndex];
                                first += 1;
                                firstIndex += 1;
                            }
                            if (first !== secondIndex) {
                                while (secondLen !== secondIndex) {
                                    collection[first] = collection[secondIndex];
                                    first += 1;
                                    secondIndex += 1;
                                }
                            }
                        }
                    };
                merge(collection, fnCompare, 0, collectionLen);
                return collection;
            };
            this.selectionSort = function (colection, fnCompare) {
                var swap = this.swap,
                    size = colection.length,
                    min,
                    i,
                    j;
                for (i = 0; i < size - 1; i += 1) {
                    min = i;
                    for (j = i + 1; j < size; j += 1) {
                        if (fnCompare(colection[min], colection[j]) > 0) {
                            min = j;
                        }
                    }
                    swap(colection, i, min);
                }
                return colection;
            };
        };
    Moa.mixin('mixSort', mix);
    return mix;
});
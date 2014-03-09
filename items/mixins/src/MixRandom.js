/**
 * Created by Pencroff on 20.11.13.
 */
/*global define:true*/
define('mixinsSrc/MixRandom', ['Moa'], function (Moa) {
    "use strict";
    var undef,
        mix = function () {
            this.getRnd = function (range) {
                return Math.floor((Math.random() * range));
            };
            this.getRndIn = function (min, max) {
                return Math.floor((Math.random() * (max - min + 1)) + min);
            };
        };
    Moa.mixin('mixRandom', mix);
    return mix;
});
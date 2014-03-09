/**
 * Created by Pencroff on 22.11.13.
 */
/*global define:true, describe:true, it:true*/
define(['Moa', 'chai', 'sinon', 'mixinsSrc/MixRandom'], function (Moa, chai, sinon) {
    'use strict';
    var expect = chai.expect;
    describe('Test Algorithm Mixin', function () {
        it('Test Random Mixin - getRnd', function (done) {
            var base = {
                    $mixin: {
                        mixRandom: 'mixRandom'
                    }
                },
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            expect(Ctor.prototype).to.have.ownProperty('getRnd');
            expect(Ctor.prototype.getRnd).to.be.an('function');
            sinon.stub(Math, 'random').returns(4); // http://xkcd.com/221/
            expect(Math.random()).to.equal(4);
            expect(item.getRnd(5)).to.equal(20);
            Math.random.restore();
            done();
        });
        it('Test Random Mixin - getRndIn', function (done) {
            var base = {
                    $mixin: {
                        mixRandom: 'mixRandom'
                    }
                },
                Ctor,
                item;
            Ctor = Moa.define('base', base);
            item = new Ctor();
            expect(Ctor.prototype).to.have.ownProperty('getRndIn');
            expect(Ctor.prototype.getRndIn).to.be.an('function');
            sinon.stub(Math, 'random').returns(0.5); // http://xkcd.com/221/
            expect(item.getRndIn(5, 10)).to.equal(8);
            Math.random.restore();
            done();
        });
    });
});
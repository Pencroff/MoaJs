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
                    b: 'typeB'
                }
            });
            item = Moa.resolve('bigType');
            expect(item.a).to.be.an('object');
            expect(item.b).to.be.an('object');
            expect(item.a.getType()).to.equal('typeA');
            expect(item.b.getType()).to.equal('typeB');
            done();
        });
    });
});
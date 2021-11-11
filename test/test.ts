import { strict as assert } from 'assert';
import { setTimeout } from 'timers/promises';

describe('1+1', () => {

    it("should equal to 2.", () => {
        assert.equal(1+1, 2)
        assert.notEqual(1+1, 3)
    });

});

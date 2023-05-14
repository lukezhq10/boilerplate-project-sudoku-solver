const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    // Logic handles a valid puzzle string of 81 characters
    test('valid puzzle string', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.validate(input), true);
    });

    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    test('invalid puzzle string', () => {
        let input = '1.a..2.84..63.12.7.b..5.....9..1....8.2.367@.3.7.2..9.47...8..1..-6....926914.37.';
        assert.equal(solver.validate(input), false);
    });

    // Logic handles a puzzle string that is not 81 characters in length
    test('invalid puzzle string length', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.367';
        assert.equal(solver.validate(input), false);
    });
});

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

    // Logic handles a valid row placement
    test('valid row placement', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        // checks row 1 in input if 3 has been used
        assert.equal(solver.checkRowPlacement(input, 1, 4), true);
    });

    // Logic handles an invalid row placement
    test('invalid row placement', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.checkRowPlacement(input, 3, 9), false);
    });

    // Logic handles a valid column placement
    test('valid column placement', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.checkColPlacement(input, 0, 5), true);
    });

    // Logic handles an invalid column placement
    test('invalid column placement', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.checkColPlacement(input, 1, 9), false);
    });

    // Logic handles a valid region (3x3 grid) placement
    test('valid 3x3 placement', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.checkRegionPlacement(input, 3, 1, 5), true);
    });

    // Logic handles a valid region (3x3 grid) placement
    test('invalid 3x3 placement', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.checkRegionPlacement(input, 8 , 8, 3), false);
    });

    // Valid puzzle strings pass the solver
    test('valid puzzle string passes solver', () => {
        let input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.equal(solver.solve(input), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
    });

    // Invalid puzzle strings fail the solver
    test('invalid puzzle string fails solver', () => {
        let input = '1.a..2.84..63.12.7.b..5.....9..1....8.2.367@.3.7.2..9.47...8..1..-6....926914.37.';
        let input2 = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.equal(solver.solve(input), false);
        assert.equal(solver.solve(input2), false);
    });

    // Solver returns the expected solution for an incomplete puzzle
    test('solver returns expected solution for incomplete puzzle', () => {
        let input = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
        assert.equal(solver.solve(input), '568913724342687519197254386685479231219538467734162895926345178473891652851726943');
    });

});

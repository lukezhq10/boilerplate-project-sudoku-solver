'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

    });
    
  app.route('/api/solve')
  // submit form data containing puzzle as a string and returns a solution with solved puzzle
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.json({
          error: 'Required field missing'
        });
      }

      // returns error message if invalid characters in puzzle  
      if (!solver.validate(puzzle) && (/[^1-9.]/.test(puzzle))) {
        return res.json({
          error: 'Invalid characters in puzzle'
        });
      }

      // returns error message if invalid length 
      if (!solver.validate(puzzle) && (puzzle.length !== 81)) {
        return res.json({
          error: 'Expected puzzle to be 81 characters long'
        });
      }

      // returns error message if puzzle is invalid or cannot be solved
      if (!solver.solve(puzzle)) {
        return res.json({
          error: 'Puzzle cannot be solved'
        });
      }

      let solution = solver.solve(puzzle);
      return res.json({
        solution: solution
      });

    })
};

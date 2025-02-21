'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  let rows = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8
  };

  app.route('/api/check')
    // coordinate is A-I indicating row and 1-9 indicating column
    // checks if the value can be placed at the coordinate based on the puzzle
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;
      // value == undefined to account for value = 0
      if (!puzzle || !coordinate || value == undefined) {
        return res.json({
          error: 'Required field(s) missing'
        });
      }

      if (!solver.validate(puzzle) && (/[^1-9.]/.test(puzzle))) {
        return res.json({
          error: 'Invalid characters in puzzle'
        });
      }

      if (!solver.validate(puzzle) && (puzzle.length !== 81)) {
        return res.json({
          error: 'Expected puzzle to be 81 characters long'
        });
      }

      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({
          error: 'Invalid coordinate'
        })
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({
          error: 'Invalid value'
        })
      }

      // given puzzle, coordinate, value, run solver checkPlacement funcs
      // if all true, return result obj with valid property = true
      // if there's an issue, return result obj with valid property = false and conflict property dep on which check funcs fail
      let row = rows[coordinate[0]];
      let col = parseInt(coordinate[1]) - 1;
      let result = {
        valid: false,
        conflict: []
      };
      let rowCheck = solver.checkRowPlacement(puzzle, row, value);
      let colCheck = solver.checkColPlacement(puzzle, col, value);
      let regCheck = solver.checkRegionPlacement(puzzle, row, col, value);
      
      // check for conflicts
      if (!rowCheck) {
        result.conflict.push('row');
      }
      if (!colCheck) {
        result.conflict.push('column');
      }
      if (!regCheck) {
        result.conflict.push('region');
      }

      if (result.conflict.length == 0) {
        result.valid = true;
        delete result.conflict;
      }

      // check if value already exists on coordinate
      let index = (row) * 9 + col;
      if (!rowCheck && !colCheck && !regCheck && puzzle[index] == value) {
          result.valid = true;
        }
      
      return res.json(result);
    
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

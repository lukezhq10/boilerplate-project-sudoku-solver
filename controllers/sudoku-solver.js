class SudokuSolver {

  // The validate function should take a given puzzle string and check it to see if it has 81 valid characters for the input
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      console.log('puzzleString invalid length');
      return false;
    }

    for (let i = 0; i < puzzleString.length; i++) {
      if (!/[1-9.]/.test(puzzleString.charAt(i))) {
        console.log('puzzleString invalid character used');
        return false;
      }
    }

    return true;
  }

  // check if value is already in the row
  checkRowPlacement(puzzle, row, value) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row * 9 + col] == value) {
        console.log('invalid row placement');
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzle, col, value) {
    for (let row = 0; row < 9; row++) {
      if (puzzle[row * 9 + col] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzle, row, col, value) {
    // calculate top-left row and column of the 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    // check if value is already in 3x3 box
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (puzzle[i * 9 + j] == value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    
    // check if valid puzzle string
    if (!this.validate(puzzleString)) {
      console.log('invalid puzzle string sent to solver');
      return false;
    }

    // convert puzzleString to an array for easier manipulation
    const puzzle = puzzleString.split('');

    function solveRecursive(index) {
      let solver = new SudokuSolver();

      // if all cells are solved, return true
      if (index > 81) {
        return true;
      }
  
      // if current cell is not empty, move on to next cell
      if (puzzle[index] !== '.') {
        return solveRecursive(index + 1);
      }
  
      // try each possible value for the current cell
      for (let value = 1; value <= 9; value++) {
        let row = Math.floor(index / 9);
        let col = index % 9;
        // check if current value is valid for this cell
        if (solver.checkRowPlacement(puzzle, row, value) &&
            solver.checkColPlacement(puzzle, col, value) &&
            solver.checkRegionPlacement(puzzle, row, col, value)) {
          // if current value is valid, set it and move on to next cell
          puzzle[index] = value;
          if (solveRecursive(index + 1)) {
            return true;
          }
        }
      }
  
      // if no values are valid for this cell, backtrack to previous cell
      puzzle[index] = '.';
      return false;
    }

    // call recursive solver starting at index 0
    solveRecursive(0)
    
    // convert puzzle array back to a string and return it
    let solution = puzzle.join('');
    if (solution === puzzleString) {
      console.log('puzzle cannot be solved');
      return false;
    } else {
      return solution;
    }
  }
}

module.exports = SudokuSolver;


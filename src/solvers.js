/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {

  let solution = new Board({n});

  for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
      solution.togglePiece(i, j);
      if (solution.hasAnyRooksConflicts()) {
        solution.togglePiece(i, j);
      }
    }
  }

  solution = solution.rows();
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  let solution = new Board({n});

  var helper = (solution, row = 0, numRooks = 0) => {

    for(let j = 0; j < n; j++) {
      solution.togglePiece(row, j);
      if (solution.hasAnyRooksConflicts()) {
        solution.togglePiece(row, j);
        continue;
      }
      numRooks++; //1
      if(numRooks === n) {
        solutionCount++;
      } else {
        helper(solution, row + 1, numRooks)
      }
      numRooks--;
      solution.togglePiece(row, j);
    }
  }

  helper(solution);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  let solution = new Board({n});
  let answer = [];
  //[[1]]

  let helper = (solution, row = 0, numQueens = 0) => {
    for(let j = 0; j < n; j++) {
      solution.togglePiece(row, j);

      if (solution.hasAnyQueensConflicts()) {
        solution.togglePiece(row, j);
        continue;
      }
      numQueens++; //1
      if(numQueens === n && answer.length === 0) {
        solution.rows().forEach((copy) => {
          answer.push(copy.slice());
        });
      } else if (numQueens !== n) {
        helper(solution, row + 1, numQueens)
      }
      numQueens--; //0
      solution.togglePiece(row, j); //[[0]]
    }
  }

  helper(solution);

  //if answer length is still 0, return solution.rows();

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(answer));
  return answer;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

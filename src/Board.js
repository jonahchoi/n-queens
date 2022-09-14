// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {

      let filteredRow = this.get(rowIndex).filter(function(sqr) {
        return sqr !== 0 ? true : false;
      })
      // console.log(filteredRow);
      if (filteredRow.length > 1) {
        return true;
      }
      return false;// fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for(let i = 0; i < this.get('n'); i++) {
        let filteredRow = this.get(i).filter(function(sqr) {
          return sqr !== 0 ? true : false;
        })
        if (filteredRow.length > 1) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      let foundOne = false;
      for(let i = 0; i < this.get('n'); i++) {
        if(this.get(i)[colIndex] !== 0) {
          if(foundOne) {
            return true;
          }
          foundOne = true;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for(let i = 0; i < this.get('n'); i++) {
        let foundOne = false;
        for(let j = 0; j < this.get('n'); j++) {
          if(this.get(j)[i] !== 0) {
            if(foundOne) {
              return true;
            }
            foundOne = true;
          }
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      let currentX = 0;
      let currentY = majorDiagonalColumnIndexAtFirstRow;
      let foundOne = false;

      while (currentX < this.get('n') && currentY < this.get('n')) {
        if (this.get(currentX)[currentY] !== 0 && this.get(currentX)[currentY] !== undefined) {
          if(foundOne) {
            return true;
          }
          foundOne = true;
        }
        currentX++;
        currentY++;
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let x = this.get('n') - 1;
      let y = 0;

      while(x > 0 || y < this.get('n')) {

        let currentX = x;
        let currentY = y;
        let foundOne = false;

        while (currentX < this.get('n') && currentY < this.get('n')) {
          if (this.get(currentX)[currentY] !== 0) {
            if(foundOne) {
              return true;
            }
            foundOne = true;
          }
          currentX++;
          currentY++;
        }

        if(x > 0) {
          x--;
        }
        else if(x === 0) {
          y++;
        }
      }
      return false;
    },


    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      let currentX = 0;
      let currentY = minorDiagonalColumnIndexAtFirstRow;
      let foundOne = false;

      while (currentX < this.get('n') && currentY > -1) {
        if (this.get(currentX)[currentY] !== 0 && this.get(currentX)[currentY] !== undefined) {
          if(foundOne) {
            return true;
          }
          foundOne = true;
        }
        currentX++;
        currentY--;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let x = this.get('n') - 1;
      let y = this.get('n') - 1;

      while(x > 0 || y > -1) {

        let currentX = x;
        let currentY = y;
        let foundOne = false;

        while (currentX < this.get('n') && currentY > -1) {
          if (this.get(currentX)[currentY] !== 0) {
            if(foundOne) {
              return true;
            }
            foundOne = true;
          }
          currentX++;
          currentY--;
        }

        if(x > 0) {
          x--;
        }
        else if(x === 0) {
          y--;
        }
      }
      return false;
    }
    /*
      [[0,0], [0,1], [0,2], [0,3]],
      [[1,0], [1,1], [1,2], [1,3]],
      [[2,0], [2,1], [2,2], [2,3]],
      [[3,0], [3,1], [3,2], [3,3]],

    */

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

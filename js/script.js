'use strict';


// Variables
const fieldSizeModal = document.getElementById('field-size-modal'),
   game = document.getElementById('game');

const fieldSizeItems = document.querySelectorAll('.field-size-item');

const gameButtonRestart = document.getElementById('game-button-restart'),
   gameButtonExit = document.getElementById('game-button-exit');

const gameField = document.getElementById('game-field');

const gameMovesNumber = document.getElementById('game-moves-number'),
   gameRecordNumber = document.getElementById('game-record-number');

const recordModal = document.querySelectorAll('.record');

const gameWinModal = document.getElementById('game-win-modal'),
   gameWinRecord = document.getElementById('game-win-record'),
   gameWinRecordNumber = document.getElementById('game-win-record-number'),
   gameWinModalCap = document.querySelector('.game-win-modal-cap'),
   gameWinModalCloseButton = document.getElementById('game-win-modal-close-button');

let fieldSize = 9;
let movesNumber = 0, recordNumber = Infinity;



// Functions

// set field size
const setFieldSize = (fieldSize) => {
   gameField.style.gridTemplateRows = `repeat(${Math.sqrt(fieldSize)}, 1fr)`;
   gameField.style.gridTemplateColumns = `repeat(${Math.sqrt(fieldSize)}, 1fr)`;
};

// remove all previous field cells
const removeFieldCells = () => {
   if (gameField.hasChildNodes()) {
      gameField.innerHTML = '';
   }
};

// create field cells
const createFieldCells = (fieldSize) => {
   // while need to create a field cell do this
   for (let counter = 0; counter < fieldSize; ++counter) {
      const cell = document.createElement('div');
      // create empty cell with class 'game-cell' and data-index of current cell
      cell.setAttribute('class', 'game-cell');
      cell.setAttribute('data-index', counter + 1);

      gameField.appendChild(cell);
   }
};

const getFieldSize = (event) => {
   fieldSize = event.dataset.size;

   // get number of field rows 
   const fieldRows = Math.sqrt(fieldSize);

   // set previous record on current game
   if (localStorage.getItem(`FieldRecordNumber${fieldRows}`)) {
      recordNumber = localStorage.getItem(`FieldRecordNumber${fieldRows}`);
      gameRecordNumber.innerHTML = recordNumber;
   }

   // set field size
   setFieldSize(fieldSize);
   // clear previous game field
   removeFieldCells();
   // create field cells for his size
   createFieldCells(fieldSize);
};


// Rewrite record number in game
const rewriteRecordNumber = () => {
   gameRecordNumber.innerHTML = recordNumber;
};

// Increase number of moves and Rewrite it in game
const rewriteMovesNumber = () => {
   movesNumber++;
   gameMovesNumber.innerHTML = movesNumber;
};

// Reset to start position the variable 'movesNumber'
const cleanMovesNumber = () => {
   movesNumber = 0;
   gameMovesNumber.innerHTML = "-";
};


// Open start modal for change field size
const openStartModal = () => {
   fieldSizeModal.classList.remove('visually-hidden');
};

// Close start modal for change field size
const closeStartModal = () => {
   fieldSizeModal.classList.add('visually-hidden');
};

// Open game modal
const openGame = () => {
   game.classList.remove('visually-hidden');
};

// Close game modal
const closeGame = () => {
   game.classList.add('visually-hidden');
};


// Switching the state of the cell and adjacent to it when clicked
const switchCellsColor = (adjacentCells) => {
   for (let adjacentCellIndex of adjacentCells) {
      const adjacentCell = document.querySelector(`.game-cell[data-index='${adjacentCellIndex}']`);
      adjacentCell.classList.toggle('selected');
   }
};

// Find all adjacent cells for current cell
const findAdjacentCells = (cell) => {
   const cellIndex = +cell.dataset.index;
   const numOfRows = +Math.sqrt(fieldSize);

   // it's equal to => top -> right -> bottom -> left (cells) 
   let adjacentCellsFlags = {
      top: true,
      right: true,
      bottom: true,
      left: true,
   };

   if (cellIndex % numOfRows === 1) 
      adjacentCellsFlags.left = false;
   if (cellIndex % numOfRows === 0) 
      adjacentCellsFlags.right = false;
   if (cellIndex / numOfRows <= 1)
      adjacentCellsFlags.top = false;
   if (cellIndex / numOfRows > numOfRows - 1)
      adjacentCellsFlags.bottom = false;

   let adjacentCells = [cellIndex];

   if (adjacentCellsFlags.top)
      adjacentCells.push(cellIndex - numOfRows);
   if (adjacentCellsFlags.right)
      adjacentCells.push(cellIndex + 1);
   if (adjacentCellsFlags.bottom)
      adjacentCells.push(cellIndex + numOfRows);
   if (adjacentCellsFlags.left)
      adjacentCells.push(cellIndex - 1);

   return adjacentCells;
};

// Random changing state of the cell and adjacent to it cells
const shuffleFieldCells = () => {
   let randomCellsIndex = [];
   while (randomCellsIndex.length != fieldSize * fieldSize) {
      const randomIndex = Math.floor(Math.random() * Math.floor(fieldSize));
      if (randomIndex === 0)
         randomCellsIndex.push(1);
      else randomCellsIndex.push(randomIndex);
   }
   
   for (let randomCellIndex of randomCellsIndex) {
      const randomCell = document.querySelector(`.game-cell:nth-child(${randomCellIndex})`);
      const adjacentCells = findAdjacentCells(randomCell);

      switchCellsColor(adjacentCells);
   }
};


// Show your record on game start modal
const showRecords = () => {
   for (let record of recordModal) {
      const rows = record.dataset.rows;
      if (localStorage.getItem(`FieldRecordNumber${rows}`)) {
         record.classList.remove('visually-hidden');

         const recordModalNumber = record.querySelector('.record-number');
         recordModalNumber.innerHTML = localStorage.getItem(`FieldRecordNumber${rows}`);
      }
   }
   gameWinRecordNumber.innerHTML = recordNumber;
};


// Open win modal
const openWinModal = (recordNumber, newRecordNumberFlag) => {
   gameWinModal.classList.remove('visually-hidden');

   // If your beat a new record show it on screen else hide
   if (newRecordNumberFlag) {
      gameWinRecordNumber.innerHTML = recordNumber;
      gameWinRecord.classList.remove('visually-hidden');
   }
   else
      gameWinRecord.classList.add('visually-hidden');
};

// Close win modal
const closeWinModal = () => {
   gameWinModal.classList.add('visually-hidden');
};


// remember the game record
const storeRecordNumber = (recordNumber) => {
   const fieldRows = Math.sqrt(fieldSize);
   localStorage.setItem(`FieldRecordNumber${fieldRows}`, recordNumber);
};

// check if the game is over
const checkGameWin = () => {
   const fieldCells = document.querySelectorAll('.game-cell.selected');
   // check if all field cells are in winning state
   if (fieldCells.length === 0) {
      // checking for a new game record and rewrite it
      let newRecordNumberFlag = false;
      if (movesNumber < recordNumber) {
         recordNumber = movesNumber;
         newRecordNumberFlag = true;
      }

      // close game and open win modal
      closeGame();
      openWinModal(recordNumber, newRecordNumberFlag);
      
      // remember my new record and show it on start modal
      storeRecordNumber(recordNumber);
      showRecords();

      // remove all previous game moves and records
      cleanMovesNumber();
      rewriteRecordNumber();

      // random shuffle field cells 
      shuffleFieldCells();
   }
};

// Functions call
showRecords();


// Event Listeners

for (let fieldSizeItem of fieldSizeItems) {
   fieldSizeItem.addEventListener('click', function() {
      getFieldSize(this);

      closeStartModal();
      openGame();

      shuffleFieldCells();
   });
}

// Restart game
gameButtonRestart.addEventListener('click', () => {
   shuffleFieldCells();

   cleanMovesNumber();
});

// Exit from current game
gameButtonExit.addEventListener('click', () => {
   cleanMovesNumber();

   closeGame();
   openStartModal();
});

gameField.addEventListener('click', (event) => {
   const cell = event.target;
   if (cell.classList.contains('game-cell')) {
      const adjacentCells = findAdjacentCells(cell);

      rewriteMovesNumber();
      switchCellsColor(adjacentCells);
      checkGameWin();
   }
});

// Closing win modal
gameWinModalCap.addEventListener('click', () => {
   closeWinModal();
   openStartModal();
});

gameWinModalCloseButton.addEventListener('click', () => {
   closeWinModal();
   openStartModal();
});
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
   gameWinModalCap = document.querySelector('.game-win-modal-cap');

let fieldSize = 9;
let movesNumber = 0, recordNumber = Infinity;



// Functions
const setFieldSize = (fieldSize) => {
   gameField.style.gridTemplateRows = `repeat(${Math.sqrt(fieldSize)}, 1fr)`;
   gameField.style.gridTemplateColumns = `repeat(${Math.sqrt(fieldSize)}, 1fr)`;
};

const removeFieldCells = () => {
   if (gameField.hasChildNodes()) {
      gameField.innerHTML = '';
   }
};

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

   const rows = Math.sqrt(fieldSize);
   if (localStorage.getItem(`FieldRecordNumber${rows}`)) {
      recordNumber = localStorage.getItem(`FieldRecordNumber${rows}`);
      gameRecordNumber.innerHTML = recordNumber;
   }

   setFieldSize(fieldSize);

   removeFieldCells();
   createFieldCells(fieldSize);
};


const rewriteRecordNumber = () => {
   gameRecordNumber.innerHTML = recordNumber;
};

const rewriteMovesNumber = () => {
   movesNumber++;
   gameMovesNumber.innerHTML = movesNumber;
};

const cleanMovesNumber = () => {
   movesNumber = 0;
   gameMovesNumber.innerHTML = "-";
};


const openModal = () => {
   fieldSizeModal.classList.remove('visually-hidden');
};

const closeModal = () => {
   fieldSizeModal.classList.add('visually-hidden');
};

const openGame = () => {
   game.classList.remove('visually-hidden');
};

const closeGame = () => {
   game.classList.add('visually-hidden');
};


const switchCellsColor = (adjacentCells) => {
   for (let adjacentCellIndex of adjacentCells) {
      const adjacentCell = document.querySelector(`.game-cell[data-index='${adjacentCellIndex}']`);
      adjacentCell.classList.toggle('selected');
   }
};

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


// Initialize your previous best result
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

const openWinModal = () => {
   gameWinModal.classList.remove('visually-hidden');
};

const closeWinModal = () => {
   gameWinModal.classList.add('visually-hidden');
};

const showWinModal = (recordNumber, newRecordNumberFlag) => {
   closeGame();
   openWinModal();

   if (newRecordNumberFlag) {
      gameWinRecordNumber.innerHTML = recordNumber;
      gameWinRecord.classList.remove('visually-hidden');
   }
   else
      gameWinRecord.classList.add('visually-hidden');
};

const storeRecordNumber = (recordNumber) => {
   const fieldRows = Math.sqrt(fieldSize);
   localStorage.setItem(`FieldRecordNumber${fieldRows}`, recordNumber);
};

const checkGameWin = () => {
   const fieldCells = document.querySelectorAll('.game-cell.selected');
   if (fieldCells.length === 0) {
      // check new record number if it's true change newRecordNumberFlag
      let newRecordNumberFlag = false;
      if (movesNumber < recordNumber) {
         recordNumber = movesNumber;
         newRecordNumberFlag = true;
      }

      showWinModal(recordNumber, newRecordNumberFlag);
      
      storeRecordNumber(recordNumber);
      showRecords();

      cleanMovesNumber();
      rewriteRecordNumber();

      shuffleFieldCells();
   }
};

// Functions call
showRecords();


// Event Listeners

for (let fieldSizeItem of fieldSizeItems) {
   fieldSizeItem.addEventListener('click', function() {
      getFieldSize(this);

      closeModal();
      openGame();

      shuffleFieldCells();
   });
}


gameButtonRestart.addEventListener('click', () => {
   shuffleFieldCells();

   cleanMovesNumber();
});

gameButtonExit.addEventListener('click', () => {
   cleanMovesNumber();

   closeGame();
   openModal();
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


gameWinModalCap.addEventListener('click', () => {
   closeWinModal();
   openModal();
});

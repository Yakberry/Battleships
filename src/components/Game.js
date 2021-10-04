import React, {useState} from 'react';
import '../styles/Game.css';
import Board from './Board';
import BoardPlayer from './BoardPlayer';
import {getRandInt} from '../global';

  function Game() {
    const [mode, setMode] = useState("menu");
    const [turnPlayer, setTurnPlayer] = useState(true);
    const [gameEnd, setGameEnd] = useState(false);
    const [playerShips, setPlayerShips] = useState(Array(10).fill(0).map(row => new Array(10).fill(0)))
    const [enemyShips, setEnemyShips] = useState(Array(10).fill(0).map(row => new Array(10).fill(0)))
    const [playerName, setPlayerName] = useState("Guest");
    const [log, setLog] = useState("");

    function passTurn(key)
    {
      if (key === "player")
      {
        setTurnPlayer(false)
      }
      else if (key === "ai")
      {
        setTurnPlayer(true)
      }
      console.log("Turn changed to" + turnPlayer)
    }

    function finishGame(winner)
    {
      if (winner === "player")
      {
        addLog(playerName + " wins!")
        setGameEnd("player");
      }
      else
      {
        addLog("The machine is victorious!")
        setGameEnd("ai");
      }
    }

    function addLog(text)
    {
      let newLog = log + `\n` + text;
      setLog(newLog)
    }

    function handleNameChange(e)
    {
      setPlayerName(e.target.value);
    }

    function backToMenu() 
    {
      setPlayerShips(Array(10).fill(0).map(row => new Array(10).fill(0)));
      setEnemyShips(Array(10).fill(0).map(row => new Array(10).fill(0)));
      setGameEnd(false);
      setTurnPlayer(true);
      setLog("");
      setMode("menu");
    }

    function popupEnd()     // Popup appears only when the game is concluded
    {
      return (
        <div className="popup-wrapper">
          <div className="popup">
            {gameEnd==="player" && "You won!"}
            {gameEnd==="ai" && "You lost!"}
            <button className="popup-back-button"  onClick={() => backToMenu()}>
            Return to menu
            </button>
          </div>
        </div>
      )
    }

    /*  Ship placing functions  */

    function prepareBoards()
    {
      arrangeShips(playerShips, true);
      arrangeShips(enemyShips, false);
      setMode("game");
    }

    function arrangeShips(arrStart, isPlayer) {
      var arr = arrStart.slice();
      autoArrangeShips(arr, 1, 4);
      autoArrangeShips(arr, 2, 3);
      autoArrangeShips(arr, 3, 2);
      autoArrangeShips(arr, 4, 1);

      for (let i = 0; i < arr.length; i++)  // 8-s mark places adjacent to ships and are needed no more
      {
        for (let j = 0; j < arr.length; j++)
        {
          if(arr[i][j] === 8) {arr[i][j] = 0}
        }
      }
      if (isPlayer)
      {
        setPlayerShips(arr)
      }
      else 
      {
        setEnemyShips(arr)
        console.log(arr)
      }
    }

    function autoArrangeShips(arr, quantity, size) {
      for (let count = quantity; count > 0; count--) {
        let success = false;
        while (!success)
        {
          let rowRand = getRandInt(0, 9);     // Random square on board
          let colRand = getRandInt(0, 9);
          if (isEmpty(rowRand, colRand, arr)) {
            let dirRand = getRandInt(0, 3);
            switch (dirRand) 
            {
              case 3: //left
              if ((colRand >= size-1) && (notOccupied(rowRand, colRand, 0, -1, size, arr))) 
              {
                placeShip(rowRand, colRand, 0, -1, size, arr)
                success = true;
              }
              break;

              case 2: //down
              if ((rowRand <= 9 - (size - 1)) && (notOccupied(rowRand, colRand, 1, 0, size, arr))) 
              {
                placeShip(rowRand, colRand, 1, 0, size, arr)
                success = true;
              }
              break;

              case 1: //right
              if ((colRand <= 9 - (size - 1)) && (notOccupied(rowRand, colRand, 0, 1, size, arr))) 
              {
                placeShip(rowRand, colRand, 0, 1, size, arr)
                success = true;
              }
              break;

              default: //up
              if ((rowRand >= size-1) && (notOccupied(rowRand, colRand, -1, 0, size, arr))) 
              {
                placeShip(rowRand, colRand, -1, 0, size, arr)
                success = true;
              }
            }
          }
        }
      }
    }

    function notOccupied(row, col, incRow, incCol, size, arr) {   // True if each of {size} squares in 
      let suceess = true;                                         // chosen direction are neither adjacent to
      for (size; size > 0; size--) {                              // nor occupied by other ships
        if (arr[row][col] !== 0)
        {
          suceess = false;
        }
        row += incRow;
        col += incCol;
      }
      return suceess;
    }

    function isEmpty(row, col, arr)
    {
      if (arr[row][col] === 0)
      return true;
      else return false;
    }

    function placeShip(row, col, incRow, incCol, size, arr)   // The ship is placed and all squares around
    {                                                         // are marked with 8-s to ensure that no
      const newArr = arr;                                     // other ships are placed in its viscinity
      const score = size; 
      for (size; size > 0; size--)
      {   
        // Conditions are excluding index out of bounds exceptions
        if ((row+1 < arr.length) && (col+1 < arr.length)) {newArr[row+1][col+1] = 8}; 
        if ((row+1 < arr.length) && (col-1 >= 0)) {newArr[row+1][col-1] = 8};
        if (row+1 < arr.length) {newArr[row+1][col] = 8};
        if (col+1 < arr.length) {newArr[row][col+1] = 8};
        if (col-1 >= 0) {newArr[row][col-1] = 8};
        if ((row-1 >= 0) && (col+1 < arr.length)) {newArr[row-1][col+1] = 8};
        if ((row-1 >= 0) && (col-1 >= 0)) {newArr[row-1][col-1] = 8};
        if (row-1 >= 0) {newArr[row-1][col] = 8};

        newArr[row][col] = score;                                       // Score stores the real size of the
        if (size < score) {newArr[row - incRow][col - incCol] = score}; // ship, while size is how many more 
        row += incRow;                                                  // scuares it will occupate
        col += incCol;
      }

      arr = newArr;
    }

    return (
      
      <div>
        {
          (mode === "game") && 
          <div>

            <div className="label-turn">
              {turnPlayer && <label>Your turn, {playerName}!</label>}
              {!turnPlayer && <label>AI turn.</label>}
            </div>

            <div className="game">

              {gameEnd && popupEnd()}

              <div className="game-board">
                <Board 
                  ships={enemyShips}
                  turn={turnPlayer}
                  gameEnd={gameEnd}
                  playerName={playerName}
                  passTurn={passTurn}
                  addLog={addLog}
                  finishGame={finishGame}
                />
              </div>

              <div className="game-board">
                <BoardPlayer
                  ships={playerShips}
                  turn={turnPlayer}
                  gameEnd={gameEnd}
                  passTurn={passTurn}
                  addLog={addLog}
                  finishGame={finishGame}
                />
              </div>
            </div>

            <div className="game-log">
              <button className="back-button" onClick={() => backToMenu()}>Return to menu</button>
              <div className="log">
                {log}
              </div>
            </div>
          </div>
        }

        {
          (mode === "menu") && 
          <div>

            <div className="menu-label">
              Battleships
            </div>

            <div className="menu-container">
              <form className="menu-form">
                <label className="label-name">
                  Name: 
                </label>
                <input className="menu-textarea" type="text" value={playerName} onChange={handleNameChange} />
              </form>
              <button className="menu-button" onClick={() => prepareBoards()}>Play!</button>
            </div>
            
          </div>
        }
      </div>
    );
  }

  export default Game;
  export {};
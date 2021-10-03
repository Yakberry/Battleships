import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  function Board(props) {
    const [squares, setSquares] = useState(Array(10).fill(0).map(row => new Array(10).fill(null)))
    const [playerX, setPlayerX] = useState(true);
    var ships = props.ships;
    var turn = props.turn;

  

    function renderSquare(i, j) {
      return (
        <Square
          value={squares[i][j]}
          onClick={() => handleClick(i, j)}
        />
      );
    }

    function handleClick(i, j) {
      if (!turn)
      {
        return;
      }
      const squares_copy = squares.slice();
      if (squares_copy[i][j] != null)
      {
        return;
      }
      if (ships[i][j] != 0)
      {
        squares_copy[i][j] = 'X';
        isDestroyed(ships, squares_copy, i, j);
      }
      else 
      {
        squares_copy[i][j] = '*';
      }
      setSquares(squares_copy);
      console.log(i + " " + j)
      console.log(ships)
      if (squares_copy[i][j] === '*')
      {props.passTurn("player");}
    }

    return (
      
      <div>
      <ol>
      {squares.map((rows, index) => {
        return (
          <li className="board-row">
          {rows.map((cells, cIndex) => {
           // {renderSquare(index, cIndex)}
           return (<Square
          value={squares[index][cIndex]}
          onClick={() => handleClick(index, cIndex)}
        />)
          })}
          </li>
        );
        
      })}
      </ol>
      </div>
      
    )
    
  }
  
  function BoardPlayer(props) {
    const [squares, setSquares] = useState(Array(10).fill(0).map(row => new Array(10).fill(null)))
    const [playerX, setPlayerX] = useState(true);
    const [priorities, setPriorities] = useState(Array(10).fill(0).map(row => new Array(10).fill(1)))
    var ships = props.ships;
    var turn = props.turn;
    const [map, setMap] = useState(JSON.parse(JSON.stringify(props.ships)));

    useEffect(() => {
      takeTurn();
    })

    function renderSquare(i, j) {
      return (
        <Square
          value={squares[i][j]}
          //onClick={() => handleClick(i, j)}
        />
      );
    }

    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

    function takeTurn()
    {
      if (turn)
      {
        return;
      }
      sleep(300);

      const squares_copy = squares.slice();
      let targets = assumeTargets(squares_copy);
      /*let potentialTargets;

      for (let r = 0; r < squares_copy.length; r++)
      {
        for (let c = 0; c < squares_copy.length; c++)
        {
          if (squares_copy[r][c] === 'X')
          {
            
          }
        }
      }*/

      let RNG = getRandInt(0, targets.length-1)
      let i = targets[RNG][0];
      let j = targets[RNG][1];
      console.log(RNG, i, j)
      
      
      console.log("TURN AI 4 " + turn)
      if (ships[i][j] !== 0)
      {
        squares_copy[i][j] = 'X';
        isDestroyed(ships, squares_copy, i, j);
        changePriorities(i, j, 2)
      }
      else 
      {
        squares_copy[i][j] = '*';
        changePriorities(i, j, -1)
      }
      
      setSquares(squares_copy);
      console.log(i + " " + j + " - AI turn")
      mapUpdate();
      console.log(ships)
      if (squares_copy[i][j] === '*')
      {
        props.passTurn("ai");
      }
    }

    function timeout(ms) { //pass a time in milliseconds to this function
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function mapUpdate() 
    {
      const mapCopy = map.slice();
      for (let i = 0; i < map.length; i++)
      {
        for (let j = 0; j < map.length; j++)
        {
          if (ships[i][j] !== 0 && mapCopy[i][j] !== ships[i][j])
          {
            mapCopy[i][j] = ships[i][j];
          }
          if (squares[i][j] === "*" || squares[i][j] === "X")
          {
            mapCopy[i][j] = squares[i][j];
          }
          /*else if (map[i][j] === 0)
          {
            map[i][j] = null;
          }*/
        }
      }
      setMap(mapCopy);
    }

    function assumeTargets(arr)
    {
      let max = -10;
      let targets = [];
      for (let i = 0; i < arr.length; i++)
      {
        for (let j = 0; j < arr.length; j++)
        {
          if (priorities[i][j] > max && arr[i][j] !== '*' && arr[i][j] !== 'X')
          {
            //targets.splice();
            targets = []
            console.log(targets, i, j)
            max = priorities[i][j];
          }
          if (priorities[i][j] == max && arr[i][j] !== '*' && arr[i][j] !== 'X')
          {
            targets.push([i, j])
          }
        }
      }
      console.log(targets);
      return targets;
    }

    function changePriorities(row, col, value)
    {
      const newPriorities = priorities.slice()
      if (row+1 < priorities.length) 
      {
        if (value > 0 && row-1 > 0 && squares[row+1][col] === 'X')
        {
          newPriorities[row-1][col] += value
        }
        newPriorities[row+1][col] += value
      };
      if (col+1 < priorities.length) 
      {
        if (value > 0 && col-1 > 0 && squares[row][col+1] === 'X')
        {
          newPriorities[row][col-1] += value
        }
        newPriorities[row][col+1] += value
      };
      if (col-1 >= 0) 
      {
        if (value > 0 && col+1 < priorities.length && squares[row][col-1] === 'X')
        {
          newPriorities[row][col+1] += value
        }
        newPriorities[row][col-1] += value
      };
      if (row-1 >= 0) 
      {
        if (value > 0 && row+1 < priorities.length && squares[row-1][col] === 'X')
        {
          newPriorities[row+1][col] += value
        }
        newPriorities[row-1][col] += value
      };

      //newPriorities[row][col] = -1;
      console.log("Priorities!")
      console.log(newPriorities)
      setPriorities(newPriorities);
    }

    return (
      <div>
      <ol>
      {map.map((rows, index) => {
        return (
          <li className="board-row">
          {rows.map((cells, cIndex) => {
           // {renderSquare(index, cIndex)}
           return (<Square
          value={map[index][cIndex]}
        />)
          })}
          </li>
        );
        
      })}
      </ol>
      </div>
    )
  }

  function Game() {
    const [turnPlayer, setTurnPlayer] = useState(true);
    const [playerShips, setPlayerShips] = useState(Array(10).fill(0).map(row => new Array(10).fill(0)))
    const [enemyShips, setEnemyShips] = useState(Array(10).fill(0).map(row => new Array(10).fill(0)))
    const [playerName, setPlayerName] = useState();


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

    function arrangeShips(arrStart, isPlayer) {
      var arr = arrStart.slice();
      autoArrangeShips(arr, 1, 4);
      autoArrangeShips(arr, 2, 3);
      autoArrangeShips(arr, 3, 2);
      autoArrangeShips(arr, 4, 1);

      for (let i = 0; i < arr.length; i++)
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
          let rowRand = getRandInt(0, 9);
          let colRand = getRandInt(0, 9);
          if (isEmpty(rowRand, colRand, arr)) {
            let dirRand = getRandInt(0, 3);
            switch (dirRand) {
              case 3: //up
                if ((colRand >= size-1) && (notOccupied(rowRand, colRand, 0, -1, size, arr))) 
                {
                  placeShip(rowRand, colRand, 0, -1, size, arr)
                  success = true;
                }
                break;
              case 2: //right
                if ((rowRand <= 9 - (size - 1)) && (notOccupied(rowRand, colRand, 1, 0, size, arr))) 
                {
                  placeShip(rowRand, colRand, 1, 0, size, arr)
                  success = true;
                }
                break;
              case 1: //down
                if ((colRand <= 9 - (size - 1)) && (notOccupied(rowRand, colRand, 0, 1, size, arr))) 
                {
                  placeShip(rowRand, colRand, 0, 1, size, arr)
                  success = true;
                }
                break;
              default: //left
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

    function notOccupied(row, col, incRow, incCol, size, arr) {
      let suceess = true;
      for (size; size > 0; size--) {
        if ((arr[row][col] !== 0) /*|| 
        ((arr[row+1] && arr[row+1][col+1]) !== 0) ||
        ((arr[row+1] && arr[row+1][col-1]) !== 0) ||
        ((arr[row+1] && arr[row+1][col]) !== 0) ||
        (arr[row][col+1] !== 0) ||
        (arr[row][col-1] !== 0) ||
        (arr[row][col] !== 0) ||
        ((arr[row-1] && arr[row-1][col+1]) !== 0) ||
        ((arr[row-1] && arr[row-1][col-1]) !== 0) ||
        ((arr[row-1] && arr[row-1][col]) !== 0)*/)
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

    function placeShip(row, col, incRow, incCol, size, arr)
    {
      const newArr = arr;
      const score = size;
      for (size; size > 0; size--)
      {
        if ((row+1 < arr.length) && (col+1 < arr.length)) {newArr[row+1][col+1] = 8}; //Unavailable for placing
        if ((row+1 < arr.length) && (col-1 > 0)) {newArr[row+1][col-1] = 8};
        if (row+1 < arr.length) {newArr[row+1][col] = 8};
        if (col+1 < arr.length) {newArr[row][col+1] = 8};
        if (col-1 >= 0) {newArr[row][col-1] = 8};
        if ((row-1 >= 0) && (col+1 < arr.length)) {newArr[row-1][col+1] = 8};
        if ((row-1 >= 0) && (col-1 >= 0)) {newArr[row-1][col-1] = 8};
        if (row-1 >= 0) {newArr[row-1][col] = 8};
        newArr[row][col] = score;
        if (size < score) {newArr[row - incRow][col - incCol] = score};
        row += incRow;
        col += incCol;
      }

      arr = newArr;
    }

    function showEnemyShips()
    {
      console.log(enemyShips)
      console.log("enemy ^ player v")
      console.log(playerShips)
    }

    function prepareBoards()
    {
      arrangeShips(playerShips, true);
      arrangeShips(enemyShips, false);
    }
    

    return (
      <div className="game">

      <button onClick={() => prepareBoards()}>Play!</button>
      
      
      <div className="game-board">
        <Board 
          ships={enemyShips}
          turn={turnPlayer}
          passTurn={passTurn}
        />
      </div>

      <div className="game-board">
      <BoardPlayer
        ships={playerShips}
        turn={turnPlayer}
        passTurn={passTurn}
      />
      </div>
      
      

      <button style={{width:'60px', height:'50px', marginTop: '370px'}} onClick={() => showEnemyShips()}>Show Enemy Ships</button>

    </div>
    );
  }
  
  /*<div className="game-info">
        <p>It's {currentPlayer}'s turn.</p>
      </div> */

  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);

  }

  function isDestroyed(sh, battlemap, target_row, target_col)
    {
      let size = sh[target_row][target_col];  // Size of damaged ship
      let shipCells = [[target_row, target_col]];
      console.log("isDestroyed fix v")
      console.log(sh)
      console.log(battlemap)
      for (let i = 0; i < shipCells.length; i++)  // Placing all cells of damaged ship in shipCells array
      {
        if (shipCells[i][0] + 1 < sh.length && sh[shipCells[i][0] + 1][shipCells[i][1]] === size && !check2DArr(shipCells, shipCells[i][0] + 1, shipCells[i][1])) 
        {
          shipCells[shipCells.length] = [shipCells[i][0] + 1, shipCells[i][1]]
        }
        if (shipCells[i][1] + 1 < sh.length && sh[shipCells[i][0]][shipCells[i][1] + 1] === size && !check2DArr(shipCells, shipCells[i][0], shipCells[i][1] + 1)) 
        {
          shipCells[shipCells.length] = [shipCells[i][0], shipCells[i][1] + 1]
        }
        if (shipCells[i][1] - 1 >= 0 && sh[shipCells[i][0]][shipCells[i][1] - 1] === size && !check2DArr(shipCells, shipCells[i][0], shipCells[i][1] - 1)) 
        {
          shipCells[shipCells.length] = [shipCells[i][0], shipCells[i][1] - 1]
        }
        if (shipCells[i][0] - 1 >= 0 && sh[shipCells[i][0] - 1][shipCells[i][1]] === size && !check2DArr(shipCells, shipCells[i][0] - 1, shipCells[i][1])) 
        {
          shipCells[shipCells.length] = [shipCells[i][0] - 1, shipCells[i][1]]
        }
      }
      console.log(shipCells);

      let flagDestroyed = true;
      for (let i = 0; i < shipCells.length; i++)
      {
        if (battlemap[shipCells[i][0]][shipCells[i][1]] !== 'X')
        {
          flagDestroyed = false;
        }
      }

      if (flagDestroyed)  // if all cells of ship are damaged, it is considered destroyed
      {
        shipDestruction(shipCells, battlemap);
        console.log("Destroyed!")
      }

      return flagDestroyed;
    }

    function check2DArr(arr, value, value2) {   // Helps finding all cells of ship
      var result1 = arr.some(object => object[0] === value);
      var result2 = arr.some(object => object[1] === value2);
      return result1 && result2;
    }

    function shipDestruction(ship, battlemap)   // Sets '*' value to all cells adjacent to destroyed ship
    {
      for (let i = 0; i < ship.length; i++)
      {
        for (let row = -1; row < 2; row++)
        {
          for (let col = -1; col < 2; col++)
          {
            if (ship[i][0] + row < battlemap.length && 
                ship[i][0] + row >= 0 &&
                ship[i][1] + col < battlemap.length &&
                ship[i][1] + col >= 0 &&
                !battlemap[ship[i][0] + row][ship[i][1] + col])
            {
              battlemap[ship[i][0] + row][ship[i][1] + col] = '*';
            }
          }
        }
      }
    }

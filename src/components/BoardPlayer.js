import React, {useState, useEffect, useCallback} from 'react';
import Square from './Square';
import '../styles/Board.css';
import {isDestroyed, getRandInt} from '../global';


function BoardPlayer(props) {
    const [squares, setSquares] = useState(Array(10).fill(0).map(row => new Array(10).fill(null)))
    const [priorities, setPriorities] = useState(Array(10).fill(0).map(row => new Array(10).fill(1)))
    const {ships, turn, gameEnd} = props;
    const [map, setMap] = useState(ships);  // Map is the state of this board refined to be shown to the player

    useEffect(() => {
      let mapPrep = JSON.parse(JSON.stringify(props.ships));
      console.log(mapPrep);
      for (let i = 0; i < mapPrep.length; i++)
      {
        for (let j = 0; j < mapPrep.length; j++)
        {
          if (mapPrep[i][j] === 0)
          {
            mapPrep[i][j] = null;
          }
        }
      }
      console.log(mapPrep);
      setMap(mapPrep);
    }, []);
    

    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

    const takeTurn = useCallback(() => {
      if (!gameEnd)
      {
        if (turn)
        {
          return;
        }
        sleep(200);

        const squares_copy = squares.slice();
        let targets = assumeTargets(squares_copy);    // Array of all squares with same max priority
        let RNG = getRandInt(0, targets.length-1)
        let i = targets[RNG][0];
        let j = targets[RNG][1];
        let result = false;   // is end?
        let output = "";
        
        if (ships[i][j] !== 0)
        {
          squares_copy[i][j] = 'X';
          if (isDestroyed(ships, squares_copy, i, j))
          {
            switch (ships[i][j])
            {
              case 1:
                output = "\nYour 1-square submarine is wrecked!";
                break;
              case 2:
                output = "\nYour 2-square destroyer is annihilated!";
                break;
              case 3:
                output = "\nYour 3-square cruiser is destroyed!";
                break;
              default:
                output = "\nYour 4-square battleship is demolished!";
            }
          };
          changePriorities(i, j, 5)
          result = isEnd();   // If that was the last ship, the game is concluded
        }
        else 
        {
          squares_copy[i][j] = '*';
          changePriorities(i, j, -1)
          output = " - Miss"
        }
        
        setSquares(squares_copy);
        console.log(i + " " + j + " - AI turn")
        if (output !== " - Miss")
        {
          props.addLog("AI : " + (i+1) + "," + (j+1) + " - Hit" + output)
        }
        else 
        {
          props.addLog("AI : " + (i+1) + "," + (j+1) + output)
        }
        mapUpdate();
        if (result)
        {
          console.log("map, ships, squares")
          console.log(map)
          console.log(ships)
          console.log(squares)
          props.finishGame("ai");
        }
        if (squares_copy[i][j] === '*')   // On miss, pass the turn to the player        
        {
          props.passTurn("ai");
        }
      }
    }, [turn, mapUpdate])


    useEffect(() => {
      if (!turn) 
      {
        takeTurn();
      }
    }, [turn, takeTurn])

   
    function isEnd()  // True if all ships on this board are destroyed
    {
      let flagVictory = true;
      for (let i = 0; i < squares.length; i++)
      {
        for (let j = 0; j < squares.length; j++)
        {
          if (squares[i][j] === null && ships[i][j] !== 0)
          {
            flagVictory = false;
            break;
          }
        }
      }
      return flagVictory;
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
          else if (map[i][j] === 0)
          {
            map[i][j] = null;
          }
        }
      }
      setMap(mapCopy);
    }

    function assumeTargets(arr)   // All squares with max priority will form an array
    {
      let max = -10;
      let targets = [];
      for (let i = 0; i < arr.length; i++)
      {
        for (let j = 0; j < arr.length; j++)
        {
          if (priorities[i][j] > max && arr[i][j] !== '*' && arr[i][j] !== 'X')
          {
            targets = []
            console.log(targets, i, j)
            max = priorities[i][j];
          }
          if (priorities[i][j] === max && arr[i][j] !== '*' && arr[i][j] !== 'X')
          {
            targets.push([i, j])
          }
        }
      }
      console.log(targets);
      return targets;
    }

    function changePriorities(row, col, value)   // AI tries to finish off damaged ships and 
    {                                            // attacks in staggered rows for efficiency
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
      newPriorities[row][col] = -5;
      setPriorities(newPriorities);
    }

    return (
      <div>
        <ol>
          <div className="horizontal-coordinates">
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => 
              {
                return (
                  <div className="coordinate">
                  {" " + num + ". "}
                  </div>
                )
              })
            }
          </div>
          {
            map.map((rows, index) => 
            {
              return (
                <li className="board-row">
                {
                  rows.map((cells, cIndex) => 
                  {
                    return (
                      <Square
                      value={map[index][cIndex]}/>
                    )
                  })
                }
                </li>
              );
            })
          }
        </ol>
      </div>
    )
  }

  export default BoardPlayer;
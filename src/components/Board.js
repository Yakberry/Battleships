import React, {useState} from 'react';
import Square from './Square';
import '../styles/Board.css';
import {isDestroyed} from '../global';

function Board(props) {
    const [squares, setSquares] = useState(Array(10).fill(0).map(row => new Array(10).fill(null)))
    const {ships, turn, gameEnd, playerName} = props;

    function handleClick(i, j)  // The player's turns are handled here 
    {
      if (!gameEnd)
      {
        if (!turn)
        {
          return;
        }
        const squares_copy = squares.slice();
        let output = "";

        if (squares_copy[i][j] != null)
        {
          return;
        }

        if (ships[i][j] !== 0)
        {
          squares_copy[i][j] = 'X';

          if (isDestroyed(ships, squares_copy, i, j))
          {
            switch (ships[i][j])
            {
              case 1:
                output = "\nEnemy 1-square submarine is exterminated!";
                break;
              case 2:
                output = "\nEnemy 2-square destroyer is defeated!";
                break;
              case 3:
                output = "\nEnemy 3-square cruiser is decimated!";
                break;
              default:
                output = "\nEnemy 4-square battleship is vanquished!";
            }
          }

          if (isEnd())
          {
            console.log("ships, squares")
            console.log(ships)
            console.log(squares)
            props.finishGame("player");
          }
        }

        else 
        {
          squares_copy[i][j] = '*';
          output = " - Miss"
        }

        setSquares(squares_copy);
        console.log(i + " " + j)

        if (output !== " - Miss")
        {
          props.addLog(playerName + " : " + (i+1) + "," + (j+1) + " - Hit" + output)
        }

        else 
        {
          props.addLog(playerName + " : " + (i+1) + "," + (j+1) + output)
        }

        console.log(ships)
        if (squares_copy[i][j] === '*')
        {
          props.passTurn("player");
        }
      }
    }

    function isEnd()    // True if all ships on this board are destroyed
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
            squares.map((rows, index) => 
            {
              return (
                <li className="board-row">
                {
                  rows.map((cells, cIndex) => 
                  {
                    return (
                      <Square
                      value={squares[index][cIndex]}
                      onClick={() => handleClick(index, cIndex)}/>
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

  export default Board;
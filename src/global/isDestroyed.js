import {check2DArr, shipDestruction} from './index';

function isDestroyed(sh, battlemap, target_row, target_col) // If the ship is destroyed, sets destruction function and returns true
    {                                                       //
      let size = sh[target_row][target_col];  // Size of the damaged ship
      let shipCells = [[target_row, target_col]];
      for (let i = 0; i < shipCells.length; i++)  // Placing all cells of the damaged ship in shipCells array
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

    export {isDestroyed};
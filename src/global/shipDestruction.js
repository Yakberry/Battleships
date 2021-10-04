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


    export {shipDestruction};
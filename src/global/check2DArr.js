function check2DArr(arr, value, value2) {   // Helps finding all cells of ship
    var result1 = arr.some(object => object[0] === value);
    var result2 = arr.some(object => object[1] === value2);
    return result1 && result2;
  }

  export {check2DArr};
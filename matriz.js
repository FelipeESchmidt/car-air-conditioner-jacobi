import { carOutline } from "./carOutline.js";

const isInsideCar = (x, y) => {
  if (carOutline[x]) {
    return y > carOutline[x][0] && y < carOutline[x][1];
  }
  return false;
};

const geradorDeMatriz = (numbers, x, y) => {
  const matriz = [];
  for (let i = 0; i < x; i++) {
    matriz[i] = [];
    for (let j = 0; j < y; j++) {
      if (isInsideCar(i, j)) {
        matriz[i].push(numbers[0]);
      } else {
        matriz[i].push(12);
      }
    }
  }
  return matriz;
};

const t = { width: 100, height: 42 };

export const matriz = [
  geradorDeMatriz([12], t.height, t.width),
  geradorDeMatriz([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], t.height, t.width),
  geradorDeMatriz([12], t.height, t.width),
];

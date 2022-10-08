import { carOutline } from "./carOutline.js";

export const isInsideCar = (x, y) => {
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
        matriz[i].push(34);
      }
    }
  }
  return matriz;
};

const t = { width: 100, height: 42 };

export const matriz = [
  geradorDeMatriz([34], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([19], t.height, t.width),
  geradorDeMatriz([34], t.height, t.width),
];

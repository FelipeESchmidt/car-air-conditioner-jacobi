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
        matriz[i].push(numbers[1]);
      }
    }
  }
  return matriz;
};

const t = { width: 100, height: 42 };

export const mountCube = (externalTemp, internalTemp, l = 11) => {
  const c = [];
  for (let i = 0; i < l; i++) {
    c.push(geradorDeMatriz([externalTemp, externalTemp], t.height, t.width));
  }
  return c;
}

export const cube = mountCube(34, 19);

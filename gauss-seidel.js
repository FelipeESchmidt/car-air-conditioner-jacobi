import { isInsideCar } from "./matriz.js";

export const gaussSeidel = (matrix) => {
  const newMatrix = JSON.parse(JSON.stringify(matrix));

  const divBy = 1 / 6;

  for (let i = 1; i < newMatrix.length - 1; i++) {
    for (let j = 1; j < newMatrix[i].length - 1; j++) {
      for (let k = 1; k < newMatrix[i][j].length - 1; k++) {
        if (isInsideCar(j, k)) {
          newMatrix[i][j][k] =
            divBy *
            (newMatrix[i - 1][j][k] +
              newMatrix[i][j - 1][k] +
              newMatrix[i][j][k - 1] +
              newMatrix[i + 1][j][k] +
              newMatrix[i][j + 1][k] +
              newMatrix[i][j][k + 1]);
        }
      }
    }
  }

  return newMatrix;
};

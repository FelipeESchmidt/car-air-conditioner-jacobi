import { SelectFactory } from "./hooks/selectFactory.js";
import { mountNewTable } from "./utils/tableGenerator.js";
import { gaussSeidel } from "./math/gauss-seidel.js";
import { matriz } from "./math/matriz.js";

let table = document.getElementById("tabela-principal");
let botaoRender = document.getElementById("render");
let botaoReset = document.getElementById("reset");
let inputRange = document.getElementById("layer");
inputRange.setAttribute("max", matriz.length - 1);

window.onload = () => {
  let matrixUsed = matriz;

  const selectFac = new SelectFactory(matriz.length, (selection) => {
    table.innerHTML = mountNewTable(matrixUsed[selection]);
  });

  inputRange.addEventListener("input", (e) => {
    selectFac.changeSelected(e.target.value);
  });

  botaoRender.addEventListener("click", () => {
    matrixUsed = gaussSeidel(matrixUsed);
    selectFac.callCallback();
  });

  botaoReset.addEventListener("click", () => {
    matrixUsed = matriz;
    selectFac.callCallback();
  });
};

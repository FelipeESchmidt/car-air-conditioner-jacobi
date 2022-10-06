import { jacobi } from "./gauss-seidel.js";
import { matriz } from "./matriz.js";

let table = document.getElementById("tabela-principal");
let botaoRender = document.getElementById("render");
let inputRange = document.getElementById("layer");
inputRange.setAttribute("max", matriz.length - 1);

class SelectFactory {
  selected = 0;
  maxSelected = 0;
  changeCallback = () => {};

  constructor(maxSelected, callback) {
    this.maxSelected = maxSelected;
    this.changeCallback = callback;
    this.changeSelected(0);
  }

  changeSelected(newSelection) {
    if (newSelection < this.maxSelected) {
      this.selected = newSelection;
      this.changeCallback(this.selected);
      return;
    }
    this.selected = 0;
    this.changeCallback(this.selected);
  }

  callCallback() {
    this.changeCallback(this.selected);
  }
}

const getItemClasses = (value) => {
  const truncadeValue = Math.trunc(value);
  const restValue = 10 - Math.round((value - truncadeValue) * 10);
  const classes = ["v"];
  classes.push(`v_${truncadeValue}`);
  classes.push(`o_${restValue}`);
  return classes.join(" ");
};

const renderNewTable = (m) => {
  table.innerHTML = m
    .map(
      (col) =>
        `<tr>${col
          .map((line) => `<td class="${getItemClasses(line)}"></td>`)
          .join("")}</tr>`
    )
    .join("");
};

window.onload = () => {
  let matrixUsed = matriz;

  const selectFac = new SelectFactory(matriz.length, (selection) => {
    renderNewTable(matrixUsed[selection]);
  });

  inputRange.addEventListener("input", (e) => {
    selectFac.changeSelected(e.target.value);
  });

  botaoRender.addEventListener("click", () => {
    matrixUsed = jacobi(matrixUsed);
    selectFac.callCallback();
  });
};

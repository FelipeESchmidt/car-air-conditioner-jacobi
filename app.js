import { matriz } from "./matriz.js";

let table = document.getElementById("tabela-principal");
let botao = document.getElementById("next");
let botaoRender = document.getElementById("render");

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
  const selectFac = new SelectFactory(matriz.length, (selection) => {
    renderNewTable(matriz[selection]);
  });

  botao.addEventListener("click", () => {
    selectFac.changeSelected(selectFac.selected + 1);
  });

  botaoRender.addEventListener("click", () => {
    selectFac.callCallback();
  });
};

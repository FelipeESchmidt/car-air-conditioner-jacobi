import { AirConfigurationFactory } from "./hooks/airConfigurationFactory.js";
import { AirConditionerFactory } from "./hooks/airConditionerFactory.js";
import { SelectFactory } from "./hooks/selectFactory.js";
import { mountNewTable } from "./utils/tableGenerator.js";
import { gaussSeidel } from "./math/gauss-seidel.js";
import { cube } from "./math/matriz.js";
import { applyAir } from "./math/airConditioner.js";

let table = document.getElementById("tabela-principal");
let botaoRender = document.getElementById("render");
let botaoReset = document.getElementById("reset");
let inputRange = document.getElementById("layer");
inputRange.setAttribute("max", cube.length - 1);

window.onload = () => {
  let cubeUsed = cube;
  let isAirOn = false;
  let currentConfig = {};

  const selectFac = new SelectFactory(cube.length, (selection) => {
    table.innerHTML = mountNewTable(cubeUsed[selection]);
  });

  const airConfiguration = new AirConfigurationFactory((conf) => {
    currentConfig = conf;
    cubeUsed = applyAir(conf, cubeUsed);
    selectFac.callCallback();
  });

  new AirConditionerFactory((on) => {
    airConfiguration.changeShowing(on);
    isAirOn = on;
  });

  inputRange.addEventListener("input", (e) => {
    selectFac.changeSelected(e.target.value);
  });

  botaoRender.addEventListener("click", () => {
    cubeUsed = gaussSeidel(cubeUsed);
    cubeUsed = applyAir(currentConfig, cubeUsed);
    selectFac.callCallback();
  });

  botaoReset.addEventListener("click", () => {
    cubeUsed = cube;
    selectFac.callCallback();
  });
};

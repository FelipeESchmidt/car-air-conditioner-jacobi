import { BaseConfigurationFactory } from "./hooks/baseConfigurationFactory.js";
import { AirConfigurationFactory } from "./hooks/airConfigurationFactory.js";
import { AirConditionerFactory } from "./hooks/airConditionerFactory.js";
import { ProgramFactory } from "./hooks/programFactory.js";
import { SelectFactory } from "./hooks/selectFactory.js";

import { mountNewTable } from "./utils/tableGenerator.js";

import { gaussSeidel } from "./math/gauss-seidel.js";
import { cube, mountCube } from "./math/matriz.js";
import { applyAir } from "./math/airConditioner.js";

let table = document.getElementById("tabela-principal");
let botaoRender = document.getElementById("render");
let botaoReset = document.getElementById("reset");
let inputRange = document.getElementById("layer");
inputRange.setAttribute("max", cube.length - 1);

window.onload = () => {
  let cubeUsed = cube;
  let isAirOn = false;
  let currentAirConfig = {};
  let currentBaseConfig = {};

  const selectFac = new SelectFactory(cube.length, (selection) => {
    table.innerHTML = mountNewTable(cubeUsed[selection]);
  });

  const baseConfiguration = new BaseConfigurationFactory((conf) => {
    currentBaseConfig = conf;
    cubeUsed = mountCube(conf["temp-externa"].temp, conf["temp-interna"].temp);
    selectFac.callCallback();
  });

  const airConfiguration = new AirConfigurationFactory((conf) => {
    currentAirConfig = conf;
    cubeUsed = applyAir(conf, cubeUsed);
    selectFac.callCallback();
  });

  const airConditioner = new AirConditionerFactory((on) => {
    airConfiguration.changeShowing(on);
    isAirOn = on;
  });

  const programFac = new ProgramFactory((on) => {
    baseConfiguration.changeShowing(on);
  });

  inputRange.addEventListener("input", (e) => {
    selectFac.changeSelected(e.target.value);
  });

  botaoRender.addEventListener("click", () => {
    if (isAirOn) {
      cubeUsed = applyAir(currentAirConfig, cubeUsed);
    }
    cubeUsed = gaussSeidel(cubeUsed);
    selectFac.callCallback();
  });

  botaoReset.addEventListener("click", () => {
    cubeUsed = cube;
    airConfiguration.reset();
    airConditioner.powerButton(false);
    baseConfiguration.reset();
    programFac.powerButton(false);
    selectFac.callCallback();
  });
};

const getItemClasses = (value) => {
  const truncadeValue = Math.trunc(value);
  const restValue = 10 - Math.round((value - truncadeValue) * 10);
  const classes = ["v"];
  classes.push(`v_${truncadeValue}`);
  classes.push(`o_${restValue}`);
  return classes.join(" ");
};

const mountNewTable = (matrix) => {
  return matrix
    .map(
      (col) =>
        `<tr>${col
          .map((line) => `<td class="${getItemClasses(line)}"></td>`)
          .join("")}</tr>`
    )
    .join("");
};

const basePlane = 5;

const mountLine = (initialXYZ, inc, direction, incDiff = 0) => ({
  0: { ...initialXYZ },
  1: { ...initialXYZ, [inc]: initialXYZ[inc] + (3 - incDiff) * direction },
  2: { ...initialXYZ, [inc]: initialXYZ[inc] + (6 - incDiff) * direction },
  3: { ...initialXYZ, [inc]: initialXYZ[inc] + (10 - incDiff) * direction },
  4: { ...initialXYZ, [inc]: initialXYZ[inc] + (15 - incDiff) * direction },
});

const mountPreLine = (
  initialXYZ,
  inc,
  incPlus,
  lateral,
  lateralPlus,
  direction
) =>
  mountLine(
    {
      ...initialXYZ,
      [lateral]: initialXYZ[lateral] + lateralPlus * direction,
      [inc]: initialXYZ[inc] + incPlus * direction,
    },
    inc,
    direction,
    incPlus
  );

const mountColumns = (initialXYZ, inc, lateral, direction) => {
  const lines = [];
  for (let i = 1; i <= 10; i++) {
    lines.push(mountPreLine(initialXYZ, inc, +i, lateral, -i, direction));
    lines.push(mountPreLine(initialXYZ, inc, +i, lateral, +i, direction));
  }
  return lines;
};

const mountPosition = (initialXYZ, inc, lateral, direction, planes) => [
  mountLine(initialXYZ, inc, direction),
  ...mountColumns(initialXYZ, inc, lateral, direction),
];

const airInfo = {
  front: {
    positions: mountPosition({ x: 16, y: 27, z: basePlane }, "y", "x", 1),
    validateFor: (n, v) => n <= v,
    nextPos: (n) => ++n,
  },
  back: {
    positions: mountPosition({ x: 16, y: 81, z: basePlane }, "y", "x", -1),
    validateFor: (n, v) => n >= v,
    nextPos: (n) => --n,
  },
  up: {
    positions: mountPosition({ x: 3, y: 54, z: basePlane }, "x", "y", 1),
    validateFor: (n, v) => n <= v,
    nextPos: (n) => ++n,
  },
  down: {
    positions: mountPosition({ x: 33, y: 54, z: basePlane }, "x", "y", -1),
    validateFor: (n, v) => n >= v,
    nextPos: (n) => --n,
  },
};

const applyAirType = (configs, cube) => {
  if (!configs) return;
  const { positions, validateFor, nextPos } = airInfo[configs.type];
  positions.forEach((position) => {
    if (!configs.intensity) return;
    for (
      let i = position[0].x;
      validateFor(i, position[configs.intensity].x);
      i = nextPos(i)
    ) {
      for (
        let j = position[0].y;
        validateFor(j, position[configs.intensity].y);
        j = nextPos(j)
      ) {
        for (let k = 1; k < 10; k++) {
          const long = Math.abs(
            i - Math.abs(position[0].x) + (j - Math.abs(position[0].y))
          );
          const tempDiff = long / configs.intensity;
          cube[k][i][j] = configs.temp + tempDiff;
        }
      }
    }
  });
};

const applyAir = (configs, cube) => {
  const newCube = JSON.parse(JSON.stringify(cube));

  applyAirType(configs["ar-frontal"], newCube);
  applyAirType(configs["ar-traseiro"], newCube);
  applyAirType(configs["ar-superior"], newCube);
  applyAirType(configs["ar-inferior"], newCube);

  return newCube;
};

const carOutline = {
  2: [40, 68],
  3: [35, 73],
  4: [34, 76],
  5: [33, 77],
  6: [32, 78],
  7: [31, 79],
  8: [30, 80],
  9: [29, 81],
  10: [28, 82],
  11: [27, 83],
  12: [26, 83],
  13: [25, 83],
  14: [24, 83],
  15: [24, 83],
  16: [24, 83],
  17: [24, 83],
  18: [24, 83],
  19: [24, 83],
  20: [24, 83],
  21: [24, 83],
  22: [24, 83],
  23: [24, 83],
  24: [24, 83],
  25: [24, 75],
  26: [24, 74],
  27: [24, 72],
  28: [24, 71],
  29: [24, 71],
  30: [24, 70],
  31: [24, 70],
  32: [24, 69],
  33: [24, 69],
  34: [24, 69],
};

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
        matriz[i].push(numbers[1]);
      }
    }
  }
  return matriz;
};

const t = { width: 100, height: 42 };

const mountCube = (externalTemp, internalTemp, l = 11) => {
  const c = [];
  c.push(geradorDeMatriz([externalTemp, externalTemp], t.height, t.width));
  for (let i = 1; i < l - 1; i++) {
    c.push(geradorDeMatriz([internalTemp, externalTemp], t.height, t.width));
  }
  c.push(geradorDeMatriz([externalTemp, externalTemp], t.height, t.width));
  return c;
};

const cube = mountCube(34, 19);

const gaussSeidel = (matrix) => {
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

class ProgramFactory {
  onClasses = ["bt-configura", "bt-configura-open"];

  onButton = document.getElementById("configura");
  on = false;
  changeCallback = () => {};

  constructor(callback) {
    this.changeCallback = callback;
    this.updateClasses(true);
    this.onButton.addEventListener("click", () => this.powerButton(!this.on));
  }

  powerButton(newState) {
    this.on = newState;
    this.updateClasses();
    this.changeCallback(this.on);
  }

  callCallback() {
    this.changeCallback(this.on);
  }

  updateClasses(first = false) {
    if (first) {
      this.setOnClasses();
      return;
    }
    if (this.on) {
      this.updateOnClasses();
    } else {
      this.updateOffClasses();
    }
  }

  setOnClasses() {
    this.onButton.classList.add(this.onClasses[0]);
  }

  updateOnClasses() {
    this.onButton.classList.replace(this.onClasses[0], this.onClasses[1]);
  }

  updateOffClasses() {
    this.onButton.classList.replace(this.onClasses[1], this.onClasses[0]);
  }
}

const configurations_BaseConfigurationFactory = {
  "temp-interna": { temp: 19 },
  "temp-externa": { temp: 34 },
};

class BaseConfigurationFactory {
  showing = false;
  limits = { temp: { min: 19, max: 34 } };
  changeCallback = () => {};
  configs = {};

  constructor(callback) {
    this.changeCallback = callback;
    this.configs = JSON.parse(
      JSON.stringify(configurations_BaseConfigurationFactory)
    );
    this.bindFunctions();
  }

  changeShowing(newValue) {
    const method = newValue ? "remove" : "add";
    document.getElementById("configuracoes-programa").classList[method]("hide");
    this.showing = newValue;
  }

  reset() {
    this.configs = JSON.parse(
      JSON.stringify(configurations_BaseConfigurationFactory)
    );
    Object.keys(this.configs).map((id) => {
      this.changeTemp(id, configurations_BaseConfigurationFactory[id].temp);
    });
  }

  increaseTemp(id) {
    if (this.configs[id].temp !== this.limits.temp.max) {
      this.configs[id].temp += 1;
    }
    this.changeTemp(id, this.configs[id].temp);
    this.changeCallback(this.configs);
  }

  decreaseTemp(id) {
    if (this.configs[id].temp !== this.limits.temp.min) {
      this.configs[id].temp -= 1;
    }
    this.changeTemp(id, this.configs[id].temp);
    this.changeCallback(this.configs);
  }

  changeTemp(id, value) {
    document
      .querySelector(`#${id} input[data-type=temp]`)
      .setAttribute("value", `${value}°C`);
  }

  bindFunctions() {
    const bindFunction = (element, dataType, functionToBind) => {
      element
        .querySelector(`[data-type=${dataType}]`)
        .addEventListener("click", functionToBind);
    };

    Object.keys(this.configs).map((id) => {
      const el = document.querySelector(`#${id}`);
      bindFunction(el, "mais-temp", () => this.increaseTemp(id));
      bindFunction(el, "menos-temp", () => this.decreaseTemp(id));
    });
  }
}

const configurations_AirConfigurationFactory = {
  "ar-frontal": { temp: 19, intensity: 0, type: "front" },
  "ar-traseiro": { temp: 19, intensity: 0, type: "back" },
  "ar-superior": { temp: 19, intensity: 0, type: "up" },
  "ar-inferior": { temp: 19, intensity: 0, type: "down" },
};

class AirConfigurationFactory {
  showing = false;
  limits = { temp: { min: 19, max: 26 }, intensity: { min: 0, max: 4 } };
  changeCallback = () => {};
  configs = {};

  constructor(callback) {
    this.changeCallback = callback;
    this.configs = JSON.parse(
      JSON.stringify(configurations_AirConfigurationFactory)
    );
    this.bindFunctions();
  }

  changeShowing(newValue) {
    if (!newValue) this.reset();
    const method = newValue ? "remove" : "add";
    document.getElementById("configuracoes-ar").classList[method]("hide");
    this.showing = newValue;
    this.changeCallback(this.configs);
  }

  reset() {
    this.configs = JSON.parse(
      JSON.stringify(configurations_AirConfigurationFactory)
    );
    Object.keys(this.configs).map((id) => {
      this.changeTemp(id, configurations_AirConfigurationFactory[id].temp);
      this.changeIntensity(
        id,
        configurations_AirConfigurationFactory[id].intensity
      );
    });
  }

  increaseTemp(id) {
    if (this.configs[id].temp !== this.limits.temp.max) {
      this.configs[id].temp += 1;
    }
    this.changeTemp(id, this.configs[id].temp);
    this.changeCallback(this.configs);
  }

  decreaseTemp(id) {
    if (this.configs[id].temp !== this.limits.temp.min) {
      this.configs[id].temp -= 1;
    }
    this.changeTemp(id, this.configs[id].temp);
    this.changeCallback(this.configs);
  }

  changeTemp(id, value) {
    document
      .querySelector(`#${id} input[data-type=temp]`)
      .setAttribute("value", `${value}°C`);
  }

  increaseIntensity(id) {
    if (this.configs[id].intensity !== this.limits.intensity.max) {
      this.configs[id].intensity += 1;
    }
    this.changeIntensity(id, this.configs[id].intensity);
    this.changeCallback(this.configs);
  }

  decreaseIntensity(id) {
    if (this.configs[id].intensity !== this.limits.intensity.min) {
      this.configs[id].intensity -= 1;
    }
    this.changeIntensity(id, this.configs[id].intensity);
    this.changeCallback(this.configs);
  }

  changeIntensity(id, value) {
    document
      .querySelector(`#${id} input[data-type=intensidade]`)
      .setAttribute("value", `${value}`);
  }

  bindFunctions() {
    const bindFunction = (element, dataType, functionToBind) => {
      element
        .querySelector(`[data-type=${dataType}]`)
        .addEventListener("click", functionToBind);
    };

    Object.keys(this.configs).map((id) => {
      const el = document.querySelector(`#${id}`);
      bindFunction(el, "mais-temp", () => this.increaseTemp(id));
      bindFunction(el, "menos-temp", () => this.decreaseTemp(id));
      bindFunction(el, "mais-int", () => this.increaseIntensity(id));
      bindFunction(el, "menos-int", () => this.decreaseIntensity(id));
    });
  }
}

class AirConditionerFactory {
  onClasses = ["bt-liga", "bt-ligado"];
  offClasses = ["bt-desligado", "bt-desliga"];

  onButton = document.getElementById("liga");
  offButton = document.getElementById("desliga");
  on = false;
  changeCallback = () => {};

  constructor(callback) {
    this.changeCallback = callback;
    this.updateClasses(true);
    this.onButton.addEventListener("click", () => this.powerButton(true));
    this.offButton.addEventListener("click", () => this.powerButton(false));
  }

  powerButton(newState) {
    this.on = newState;
    this.updateClasses();
    this.changeCallback(this.on);
  }

  callCallback() {
    this.changeCallback(this.on);
  }

  updateClasses(first = false) {
    if (first) {
      this.setOnClasses();
      return;
    }
    if (this.on) {
      this.updateOnClasses();
    } else {
      this.updateOffClasses();
    }
  }

  setOnClasses() {
    this.onButton.classList.add(this.onClasses[0]);
    this.offButton.classList.add(this.offClasses[0]);
  }

  updateOnClasses() {
    this.onButton.classList.replace(this.onClasses[0], this.onClasses[1]);
    this.offButton.classList.replace(this.offClasses[0], this.offClasses[1]);
  }

  updateOffClasses() {
    this.onButton.classList.replace(this.onClasses[1], this.onClasses[0]);
    this.offButton.classList.replace(this.offClasses[1], this.offClasses[0]);
  }
}

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
    const newCube = mountCube(
      conf["temp-externa"].temp,
      conf["temp-interna"].temp
    );
    cubeUsed = applyAir(currentAirConfig, newCube);
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

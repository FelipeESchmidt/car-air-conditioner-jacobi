const configurations = {
  "ar-frontal": { temp: 19, intensity: 0, type: "front" },
  "ar-traseiro": { temp: 19, intensity: 0, type: "back" },
  "ar-superior": { temp: 19, intensity: 0, type: "up" },
  "ar-inferior": { temp: 19, intensity: 0, type: "down" },
};

export class AirConfigurationFactory {
  showing = false;
  limits = { temp: { min: 19, max: 26 }, intensity: { min: 0, max: 4 } };
  changeCallback = () => {};
  configs = {};

  constructor(callback) {
    this.changeCallback = callback;
    this.configs = configurations;
    this.bindFunctions();
  }

  changeShowing(newValue) {
    const method = newValue ? "remove" : "add";
    document.getElementById("configuracoes").classList[method]("hide");
    this.showing = newValue;
    this.changeCallback(this.configs);
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

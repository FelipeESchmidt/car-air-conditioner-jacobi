const configurations = {
  "temp-interna": { temp: 19 }, "temp-externa": { temp: 34 },
};

export class BaseConfigurationFactory {
  showing = false;
  limits = { temp: { min: 19, max: 34 } };
  changeCallback = () => { };
  configs = {};

  constructor(callback) {
    this.changeCallback = callback;
    this.configs = JSON.parse(JSON.stringify(configurations));
    this.bindFunctions();
  }

  changeShowing(newValue) {
    if (!newValue) this.reset();
    const method = newValue ? "remove" : "add";
    document.getElementById("configuracoes-programa").classList[method]("hide");
    this.showing = newValue;
    this.changeCallback(this.configs);
  }

  reset() {
    this.configs = JSON.parse(JSON.stringify(configurations));
    Object.keys(this.configs).map((id) => {
      this.changeTemp(id, configurations[id].temp);
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

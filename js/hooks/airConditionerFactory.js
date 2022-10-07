export class AirConditionerFactory {
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

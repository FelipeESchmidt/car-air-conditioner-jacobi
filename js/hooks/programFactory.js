export class ProgramFactory {
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

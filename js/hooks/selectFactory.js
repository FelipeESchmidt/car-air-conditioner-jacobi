export class SelectFactory {
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

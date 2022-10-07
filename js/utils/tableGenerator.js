const getItemClasses = (value) => {
  const truncadeValue = Math.trunc(value);
  const restValue = 10 - Math.round((value - truncadeValue) * 10);
  const classes = ["v"];
  classes.push(`v_${truncadeValue}`);
  classes.push(`o_${restValue}`);
  return classes.join(" ");
};

export const mountNewTable = (matrix) => {
  return matrix
    .map(
      (col) =>
        `<tr>${col
          .map((line) => `<td class="${getItemClasses(line)}"></td>`)
          .join("")}</tr>`
    )
    .join("");
};

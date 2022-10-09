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

const mountPosition = (initialXYZ, inc, lateral, direction) => [
  mountLine(initialXYZ, inc, direction),
  ...mountColumns(initialXYZ, inc, lateral, direction),
];

const airInfo = {
  front: {
    positions: mountPosition({ x: 16, y: 27 }, "y", "x", 1),
    validateFor: (n, v) => n <= v,
    nextPos: (n) => ++n,
  },
  back: {
    positions: mountPosition({ x: 16, y: 81 }, "y", "x", -1),
    validateFor: (n, v) => n >= v,
    nextPos: (n) => --n,
  },
  up: {
    positions: mountPosition({ x: 3, y: 54 }, "x", "y", 1),
    validateFor: (n, v) => n <= v,
    nextPos: (n) => ++n,
  },
  down: {
    positions: mountPosition({ x: 33, y: 54 }, "x", "y", -1),
    validateFor: (n, v) => n >= v,
    nextPos: (n) => --n,
  },
};

const applyAirType = (configs, cube) => {
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
        cube[5][i][j] = configs.temp;
      }
    }
  });
};

export const applyAir = (configs, cube) => {
  const newCube = JSON.parse(JSON.stringify(cube));

  applyAirType(configs["ar-frontal"], newCube);
  applyAirType(configs["ar-traseiro"], newCube);
  applyAirType(configs["ar-superior"], newCube);
  applyAirType(configs["ar-inferior"], newCube);

  return newCube;
};

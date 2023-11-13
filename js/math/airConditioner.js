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
    direction: { x: 0, y: 1 },
    airStrong: 14,
  },
  back: {
    positions: mountPosition({ x: 16, y: 81, z: basePlane }, "y", "x", -1),
    validateFor: (n, v) => n >= v,
    nextPos: (n) => --n,
    direction: { x: 0, y: -1 },
    airStrong: 10,
  },
  up: {
    positions: mountPosition({ x: 3, y: 54, z: basePlane }, "x", "y", 1),
    validateFor: (n, v) => n <= v,
    nextPos: (n) => ++n,
    direction: { x: 1, y: 0 },
    airStrong: 8,
  },
  down: {
    positions: mountPosition({ x: 33, y: 54, z: basePlane }, "x", "y", -1),
    validateFor: (n, v) => n >= v,
    nextPos: (n) => --n,
    direction: { x: -1, y: 0 },
    airStrong: 8,
  },
};

let appliedPositions = [];

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
          appliedPositions.push({
            x: i,
            y: j,
            z: k,
            temp: cube[k][i][j],
            type: configs.type,
            strong: airInfo[configs.type].airStrong,
          });
        }
      }
    }
  });
};

const applyAirVentilation = (cube) => {
  appliedPositions = appliedPositions.map((position) => {
    let { x, y, z, temp, type, strong } = position;
    strong--;

    const { x: incX, y: incY } = airInfo[type].direction;

    x += incX;
    y += incY;

    temp = (cube[z][x][y] + temp) / 2;

    cube[z][x][y] = temp;

    return {
      x,
      y,
      z,
      temp,
      type,
      strong,
    };
  });

  appliedPositions = appliedPositions.filter((position) => position.strong > 0);
};

export const applyAir = (configs, cube) => {
  const newCube = JSON.parse(JSON.stringify(cube));

  applyAirType(configs["ar-frontal"], newCube);
  applyAirType(configs["ar-traseiro"], newCube);
  applyAirType(configs["ar-superior"], newCube);
  applyAirType(configs["ar-inferior"], newCube);

  applyAirVentilation(newCube);

  return newCube;
};

export const resetAir = () => {
  appliedPositions = [];
};

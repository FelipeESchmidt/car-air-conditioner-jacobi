const airPositions = {
  front: [
    {
      intensity: 1,
      positions: [],
    },
    {
      intensity: 2,
      positions: [],
    },
    {
      intensity: 3,
      positions: [],
    },
    {
      intensity: 4,
      positions: [],
    },
  ],
};

const applyFrontAir = ({ temp, intensity }, cube) => {
  airPositions.front
    .filter((filter) => intensity >= filter.intensity)
    .map((filteredIntensity) =>
      filteredIntensity.positions.forEach(
        ({ z, x, y }) => (cube[z][x][y] = temp)
      )
    );
};

export const applyAir = (configs, cube) => {
  const newCube = JSON.parse(JSON.stringify(cube));

  applyFrontAir(configs["ar-frontal"], newCube);

  return newCube;
};

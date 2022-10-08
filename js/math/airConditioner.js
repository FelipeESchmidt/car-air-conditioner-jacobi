const mountFirstIntensityPositions = (baseX, baseY, incX, incY) => {
  return [
    { x: baseX, y: baseY, z: 5 },
    { x: baseX + incX, y: baseY, z: 5 },
    { x: baseX, y: baseY + incY, z: 5 },
    { x: baseX + incX, y: baseY + incY, z: 5 },
    { x: baseX + incX, y: baseY + incY, z: 5 },
  ];
}

const mountAirPosition = (baseX, baseY, incX, incY) => {
  return [{ intensity: 1, positions: mountFirstIntensityPositions(baseX, baseY, incX, incY) }]
}

const airPositions = {
  front: mountAirPosition(16, 26, 1, 1),
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

export const jacobi = (array) => {
    const newValues = [];
    for (let i = 1; i < array.length -1; i++) {
        newValues.push([])
        for (let j = 1; j < array[i].length -1; j++) {
            newValues[i-1].push(0.25 * ( array[i-1][j] + array[i][j-1] + array[i+1][j] + array[i][j+1] ));
        }
    }
    const newArray = array.map(x => x)
    newValues.forEach((nvl, nvli) => nvl.forEach((nvc, nvci) => newArray[nvli+1][nvci+1] = nvc))
    return newArray
}
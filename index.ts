import { LedMatrix } from 'rpi-led-matrix';


const wait = (t: number) => new Promise(ok => setTimeout(ok, t));

(async () => {
  try {

console.log('Init..2');


  const matrix = new LedMatrix(
    {
      ...LedMatrix.defaultMatrixOptions(),
      rows: 16,
      cols: 32,
      chainLength: 4,
      rowAddressType: 2,
      multiplexing: 3,
      pwmLsbNanoseconds: 1500
    },
    {
      ...LedMatrix.defaultRuntimeOptions(),
      gpioSlowdown: 2
    }
  );


  matrix
    .brightness(100)
    .fgColor(0xFFFFFF)
    .fill();

  matrix
    .sync();


  await wait(999);
}
catch (error) {
  console.error(`${__filename} caught: `, error);
}
})();

/*
matrix
  .clear()            // clear the display
  .brightness(100)    // set the panel brightness to 100%
  .fgColor(0x0000FF)  // set the active color to blue
  .fill()             // color the entire diplay blue
  .fgColor(0xFFFF00)  // set the active color to yellow
  // draw a yellow circle around the display
  .drawCircle(matrix.width() / 2, matrix.height() / 2, matrix.width() / 2 - 1)
  // draw a yellow rectangle
  .drawRect(matrix.width() / 4, matrix.height() / 4, matrix.width() / 2, matrix.height() / 2)
  // sets the active color to red
  .fgColor({ r: 255, g: 0, b: 0 })
  // draw two diagonal red lines connecting the corners
  .drawLine(0, 0, matrix.width(), matrix.height())
  .drawLine(matrix.width() - 1, 0, 0, matrix.height() - 1)
  .sync();
*/

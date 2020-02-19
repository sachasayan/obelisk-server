import {
  GpioMapping,
  LedMatrix,
  LedMatrixUtils,
  MatrixOptions,
  PixelMapperType,
  RuntimeOptions,
} from 'rpi-led-matrix';

import { Pac } from './pac';
import { Rain } from './rain';
import { Pulse } from './pulse';
// import * as prompts from 'prompts';

export const matrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows: 16,
  cols: 32,
  chainLength: 4,
  brightness: 20,
  rowAddressType: 2,
  multiplexing: 3,
  hardwareMapping: GpioMapping.Regular,
  pwmLsbNanoseconds: 1500,
  pixelMapperConfig: LedMatrixUtils.encodeMappers(
    { type: PixelMapperType.Rotate, angle: 180 }
  )
};

export const runtimeOptions: RuntimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 2
};

const wait = (t: number) => new Promise(ok => setTimeout(ok, t));



// enum CliMode {
//   Pac = 'pac',
//   Rain = 'rain',
//   Pulse = 'pulse',
//   Exit = 'exit'
// }


// const createModeSelector = () => {
//   return async () => {
//     const { mode } = await prompts({
//       name: 'mode',
//       type: 'select',
//       message: 'What would you like to do?',
//       hint: 'Use tab or arrow keys and press enter to select.',
//       choices: [
//         { value: CliMode.Pac, title: '🟡 Pacman' },
//         { value: CliMode.Rain, title: '🌧 Rain' },
//         { value: CliMode.Pulse, title: '🕺 Pulse' },
//         { value: CliMode.Exit, title: '🚪 Exit' },
//       ],
//     });

//     return mode as CliMode;
//   };
// };
// const chooseMode = createModeSelector();

(async () => {
  try {
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);

    matrix
      .clear()
      .brightness(20);

      Pac.init(matrix);

      // while (true) {
      //   switch (await chooseMode()) {
      //     case CliMode.Pac: {
      //       while (true) {
      //         Pac.init(matrix);
      //       }
      //       break;
      //     }
      //     case CliMode.Rain: {
      //       while (true) {
      //         Rain.init(matrix);
      //       }
      //       break;
      //     }


      //     case CliMode.Pulse: {
      //       // Stay in text mode until escaped
      //       while (true) {
      //         Pulse.init(matrix);
      //       }
      //       break;
      //     }
      //     case CliMode.Exit: {
      //       console.log('Bye!');
      //       process.exit(0);
      //     }
      //   }
      // }


    matrix.sync();

    await wait(999999999);
  }
  catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();

// matrix
// .clear()            // clear the display
// .brightness(100)    // set the panel brightness to 100%
// .fgColor(0x0000FF)  // set the active color to blue
// .fill()             // color the entire diplay blue
// .fgColor(0xFFFF00)  // set the active color to yellow
// // draw a yellow circle around the display
// .drawCircle(matrix.width() / 2, matrix.height() / 2, matrix.width() / 2 - 1)
// // draw a yellow rectangle
// .drawRect(matrix.width() / 4, matrix.height() / 4, matrix.width() / 2, matrix.height() / 2)
// // sets the active color to red
// .fgColor({ r: 255, g: 0, b: 0 })
// // draw two diagonal red lines connecting the corners
// .drawLine(0, 0, matrix.width(), matrix.height())
// .drawLine(matrix.width() - 1, 0, 0, matrix.height() - 1);
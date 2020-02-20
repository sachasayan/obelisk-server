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
import * as prompts from 'prompts';

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



enum CliMode {
  Pac = 'pac',
  Rain = 'rain',
  Pulse = 'pulse',
  Exit = 'exit'
}


const createModeSelector = () => {
  return async () => {
    const { mode } = await prompts({
      name: 'mode',
      type: 'select',
      message: 'What would you like to do?',
      hint: 'Use tab or arrow keys and press enter to select.',
      choices: [
        { value: CliMode.Pac, title:  '🟡 => Pacman' },
        { value: CliMode.Rain, title: '🚀 => Space' },
        { value: CliMode.Pulse, title:'🕺 => Pulse' },
        { value: CliMode.Exit, title: '🚪 => Exit' },
      ],
    });

    return mode as CliMode;
  };
};
const chooseMode = createModeSelector();

(async () => {
  try {
    const matrix = new LedMatrix(matrixOptions, runtimeOptions);

    matrix
      .clear()
      .brightness(20);

      while (true) {
        switch (await chooseMode()) {
          case CliMode.Pac: {
            matrix.afterSync(() => {});
              Pac.init(matrix);
            break;
          }
          case CliMode.Rain: {
            matrix.afterSync(() => {});
              Rain.init(matrix);
            break;
          }
          case CliMode.Pulse: {
            matrix.afterSync(() => {});
              Pulse.init(matrix);
            break;
          }
          case CliMode.Exit: {
            console.log('Bye!');
            process.exit(0);
          }
        }
      }
  }
  catch (error) {
    console.error(`${__filename} caught: `, error);
  }
})();
import {
  GpioMapping,
  LedMatrix,
  LedMatrixUtils,
  MatrixOptions,
  PixelMapperType,
  RuntimeOptions,
} from 'rpi-led-matrix';

import { Test } from './test';
// import { Pac } from './_pac';
// import { Munchman } from './munchman';
import { Space } from './space';
import { Pulse } from './pulse';
import { Pong } from './pong';
import { Lightcycles } from './lightcycles';
import * as prompts from 'prompts';

export const matrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows: 16,
  cols: 32,
  chainLength: 4,
  brightness: 100,
  rowAddressType: 2,
  multiplexing: 3,
  hardwareMapping: GpioMapping.Regular,
  pwmLsbNanoseconds: 500,
  pixelMapperConfig: LedMatrixUtils.encodeMappers(
    { type: PixelMapperType.Rotate, angle: 180 }
  )
};

export const runtimeOptions: RuntimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 4
};

const wait = (t: number) => new Promise(ok => setTimeout(ok, t));

enum CliMode {
  Test = 'test',
  Pac = 'pac',
  Space = 'space',
  Pulse = 'pulse',
  Pong = 'pong',
  Munchman = 'munchman',
  Lightcycles = 'lightcycles',
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
        { value: CliMode.Test, title:  '(Test Mode)' },
        // { value: CliMode.Munchman, title:  '🟡 => Munchman' },
        { value: CliMode.Space, title: '🚀 => Space' },
        { value: CliMode.Pulse, title:'🕺 => Pulse' },
        { value: CliMode.Pong, title:'🎾 => Pong' },
        { value: CliMode.Lightcycles, title:'🏍\s => Lightcycles' },
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
    matrix.clear();

    while (true) {
      switch (await chooseMode()) {
        case CliMode.Test: {
          matrix.afterSync(() => {});
          Test.init(matrix);
          break;
        }
        case CliMode.Munchman: {
          matrix.afterSync(() => {});
          // Munchman.init(matrix);
          break;
        }
        case CliMode.Space: {
          matrix.afterSync(() => {});
          Space.init(matrix);
          break;
        }
        case CliMode.Pulse: {
          matrix.afterSync(() => {});
          Pulse.init(matrix);
          break;
        }
        case CliMode.Pong: {
          matrix.afterSync(() => {});
          Pong.init(matrix);
          break;
        }
        case CliMode.Lightcycles: {
          matrix.afterSync(() => {});
          Lightcycles.init(matrix);
          break;
        }
        case CliMode.Exit: {
          matrix.afterSync(() => {});
          matrix.clear().sync();
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
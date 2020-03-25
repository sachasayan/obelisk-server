import {
  GpioMapping,
  LedMatrix,
  LedMatrixUtils,
  MatrixOptions,
  PixelMapperType,
  RuntimeOptions,
} from 'rpi-led-matrix';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

let players = [];
let playerData = [];

function onConnection(socket){
  console.log(socket);
  players = [socket];
  socket.emit('obeliskAssignUser', players.length);
  socket.on('drawing', (data) => {playerData[data.player] = {y: data.y}; });
  socket.on('disconnect', (reason) => {
    console.log('Disconnect ' + socket.id + ' ' + reason);
    players = players.filter(s => s.id != socket.id );
    players.forEach((s, i) => s.emit('obeliskAssignUser',  i+1));
  });
};

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));


import { Billboard } from './billboard';
import { Lightcycles } from './lightcycles';
import { Munchman } from './munchman';
import { Pong } from './pong';
import { Pulse } from './pulse';
import { Space } from './space';
import { Sunlight } from './sunlight';
import { Test } from './test';
import * as prompts from 'prompts';

export const matrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows: 16,
  cols: 32,
  chainLength: 4,
  brightness: 50,
  rowAddressType: 2,
  multiplexing: 3,
  hardwareMapping: GpioMapping.Regular,
  pwmLsbNanoseconds: 1500,
  pwmBits: 8,
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
  Billboard = 'billboard',
  Lightcycles = 'lightcycles',
  Munchman = 'munchman',
  Pac = 'pac',
  Pong = 'pong',
  Pulse = 'pulse',
  Space = 'space',
  Sunlight = 'sunlight',
  Test = 'test',
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
        { value: CliMode.Billboard, title:'🔤 => Billboard' },
        { value: CliMode.Pong, title:'🎾 => Pong' },
        { value: CliMode.Lightcycles, title:'🏍\s => Lightcycles' },
        { value: CliMode.Munchman, title:  '🟡 => Munchman' },
        { value: CliMode.Space, title: '🚀 => Space Adventure' },
        { value: CliMode.Pulse, title:'🕺 => Twinkle' },
        { value: CliMode.Exit, title: '🚪 => Exit' },
        { value: CliMode.Sunlight, title: '🟠 => Sunlight' },
        { value: CliMode.Test, title:  '(Test Mode)' },
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
        case CliMode.Billboard: {
          matrix.afterSync(() => {});
          Billboard.init(matrix);
          break;
        }
        case CliMode.Test: {
          matrix.afterSync(() => {});
          Test.init(matrix);
          break;
        }
        case CliMode.Munchman: {
          matrix.afterSync(() => {});
          Munchman.init(matrix);
          break;
        }
        case CliMode.Space: {
          matrix.afterSync(() => {});
          Space.init(matrix);
          break;
        }
        case CliMode.Sunlight: {
          matrix.afterSync(() => {});
          Sunlight.init(matrix);
          break;
        }
        case CliMode.Pulse: {
          matrix.afterSync(() => {});
          Pulse.init(matrix);
          break;
        }
        case CliMode.Pong: {
          matrix.afterSync(() => {});
          Pong.init(matrix, playerData);
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
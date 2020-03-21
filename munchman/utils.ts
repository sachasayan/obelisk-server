import * as chroma from 'chroma-js';
import {
  BASE_COLORS
} from './types';

let fade = (t, freq, offset) => {
  return Math.abs(Math.sin(  Math.PI * (t % freq / freq - offset) ));
 };

let colors = {
  'wall': chroma.scale([0, BASE_COLORS['wall']]),
  'player': chroma.scale([0, BASE_COLORS['player']]),
  'inky': chroma.scale([0, BASE_COLORS['inky']]),
  'binky': chroma.scale([0, BASE_COLORS['binky']]),
  'pinky': chroma.scale([0, BASE_COLORS['pinky']]),
  'clyde': chroma.scale([0, BASE_COLORS['clyde']]),
  'empty': chroma.scale([0, BASE_COLORS['empty']]),
  'dot': chroma.scale([0x040404, BASE_COLORS['dot']]),
};

export { fade, colors};
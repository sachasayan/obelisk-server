let colors = {
  '*': 0x1919A6,
  'P': 0xFFFF00,
  '1': 0xFF0000,
  '2': 0xFFB8FF,
  '3': 0x00FFFF,
  '4': 0xFFB852,
  ' ': 0x000000
};




let f = grid.replace(/\n|\r/g, "");
let field = Array.from(f).map((char) => colors[char]);


// field.forEach((c, i) => {
//   matrix.fgColor(c)
//     .setPixel(i % 128, Math.floor(i / 128))


// });


let Pac = { colors, field };


export { Pac };

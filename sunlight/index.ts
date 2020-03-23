

const wait = (t: number) => new Promise(ok => setTimeout(ok, t));

function init (matrix){
  (async () => {
      matrix.clear();

      matrix
        .clear()            // clear the display
        .brightness(100)    // set the panel brightness to 100%
        .fgColor(0xffcccc)  // set the active color to blue
        .fill()             // color the entire diplay blue
        .sync();

      matrix.sync();
      await wait(999999999);
  })();
};

let Sunlight = { init };


export { Sunlight };




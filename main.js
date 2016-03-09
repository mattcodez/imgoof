"use strict";

document.addEventListener('DOMContentLoaded',init);
let $ = window.$ || document.querySelector.bind(document);
let $$ = window.$$ || document.querySelectorAll.bind(document);

function init(){
  let canvasS = $('#start');
  let canvasF = $('#finish');
  let ctxS = canvasS.getContext('2d');
  let ctxF = canvasF.getContext('2d');

  //Color Controls event handlers
  let rangeDom = $$('#colorControl input[type=range]');
  for (let i = 0; i < rangeDom.length; i++){
    let r = rangeDom[i];
    r.addEventListener('input', (e) => applyColor(ctxS, ctxF));
  }

  let img = new Image();
  img.onload = function () {
    ctxS.drawImage(img, 0, 0);
    imgoof(ctxS, ctxF);
  };
  img.src = 'apple.jpg';
}

function applyColor(ctxS, ctxF){
  let colors = {
    red:   ~~$('#colorControl .red').value,
    green: ~~$('#colorControl .green').value,
    blue:  ~~$('#colorControl .blue').value,
    alpha: ~~$('#colorControl .alpha').value
  };
  imgoof(ctxS, ctxF, colors);
}

function imgoof(ctxS, ctxF, colors){
  colors = colors || {};

  let imageData = ctxS.getImageData(0, 0, 512, 640);
  let data = imageData.data;//Uint8ClampedArray
  let buffer = data.buffer;
  let data32 = new Uint32Array(buffer); //Per-pixel access
  //Decided against 8 bit clamp because I wanted each item in the
  //buffer to be a single pixel

  let newData = new ArrayBuffer(data.length);
  let newData32 = new Uint32Array(buffer);

  data32.forEach((pixel, i) => {
    //a,b,g,r -> color bit order

    //****Get existing****
    let red   =  pixel & 0b00000000000000000000000011111111;
    let green = (pixel & 0b00000000000000001111111100000000) >>> 8;
    let blue  = (pixel & 0b00000000111111110000000000000000) >>> 16;
    let alpha = (pixel & 0b11111111000000000000000000000000) >>> 24;

    //****Perform modifications****
    //Add slider value up to 255
    //TODO Allow negative values down to 0
    red += colors.red || 0;
    red = red > 255 ? 255 : red; //If we go over 255 we'll start touching
    green += colors.green || 0;
    green = green > 255 ? 255 : green;
    blue += colors.blue || 0;
    blue = blue > 255 ? 255 : blue;
    alpha += colors.alpha || 0; //TODO doesn't do much without a background
    alpha = alpha > 255 ? 255 : alpha;

    //https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
    //****Apply modifications****

    newData32[i] =
      (alpha << 24) |
      (blue  << 16) |
      (green << 8 ) |
       red;
  });

  data.set(newData32);
  ctxF.putImageData(imageData, 0, 0);
}

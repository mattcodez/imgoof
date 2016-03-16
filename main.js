"use strict";

document.addEventListener('DOMContentLoaded',init);
let $ = window.$ || document.querySelector.bind(document);
let $$ = window.$$ || document.querySelectorAll.bind(document);

let useSIMD = false;
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

  if (typeof SIMD !== 'undefined'){
    console.log('SIMD Detected!');
    useSIMD = true;
  }
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
  let imageData = ctxS.getImageData(0, 0, 512, 640);
  let data = imageData.data;
  let buffer = data.buffer;
  let data8 = new Uint8Array(buffer); //Per-color access

  let newDataBuffer = new ArrayBuffer(data.length);
  let newData8;
  if (useSIMD){
    //if using SIMD, we don't need clamped here because we use addSaturate()
    //might it bring a performance boost?
    newData8 = new Uint8Array(newDataBuffer);
  }
  else {
    newData8 = new Uint8ClampedArray(newDataBuffer);
  }

  const startRender = new Date();
  if (useSIMD){
    SIMDLoop(data8, newData8, colors);
  }
  else {
    classicLoop(data8, newData8, colors);
  }
  const endRender = new Date();
  console.log('Render time: ', endRender - startRender);

  data.set(newData8);
  ctxF.putImageData(imageData, 0, 0);
}

function SIMDLoop(src8, dest8, colors){
  colors = colors || {};
  const rMod = colors.red || 0,
        gMod = colors.green || 0,
        bMod = colors.blue || 0,
        aMod = colors.aplha || 0;

  let modSIMD = SIMD.Int8x16(
    rMod, gMod, bMod, aMod,
    rMod, gMod, bMod, aMod,
    rMod, gMod, bMod, aMod,
    rMod, gMod, bMod, aMod
  );

  //FIX: Max range for a signed integer will be -127 to +127
  for (let i = 0; i < src8.length; i+=16){
    let srcSIMD = SIMD.Int8x16.load(src8, i);
    //returns Int8x16
    let final = SIMD.Int8x16.addSaturate(srcSIMD, modSIMD);
    SIMD.Int8x16.store(dest8, i, final);
  }
}

function classicLoop(src8, dest8, colors){
  colors = colors || {};
  const rMod = colors.red || 0,
        gMod = colors.green || 0,
        bMod = colors.blue || 0,
        aMod = colors.aplha || 0;

  for (let i = 0; i < src8.length; i+=4){

    //****Get existing****
    let red   = src8[i];
    let green = src8[i+1];
    let blue  = src8[i+2];
    let alpha = src8[i+3];

    //****Perform modifications****
    red += rMod;

    green += gMod;

    blue += bMod;

    alpha += aMod;

    //****Apply modifications****

    dest8[i] = red;
    dest8[i+1] = green;
    dest8[i+2] = blue;
    dest8[i+3] = alpha;
  }
}

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
  const rMod = colors.red || 0,
        gMod = colors.green || 0,
        bMod = colors.blue || 0,
        aMod = colors.aplha || 0;


  let imageData = ctxS.getImageData(0, 0, 512, 640);
  let data = imageData.data;
  let buffer = data.buffer;
  let data8 = new Uint8ClampedArray(buffer); //Per-color access

  let newData = new ArrayBuffer(data.length);
  let newData8 = new Uint8ClampedArray(buffer);

  const startRender = new Date();
  for (let i = 0; i < data8.length; i+=4){

    //****Get existing****
    let red   = data8[i];
    let green = data8[i+1];
    let blue  = data8[i+2];
    let alpha = data8[i+3];

    //****Perform modifications****
    red += rMod;

    green += gMod;

    blue += bMod;

    alpha += aMod;

    //****Apply modifications****

    newData8[i] = red;
    newData8[i+1] = green;
    newData8[i+2] = blue;
    newData8[i+3] = alpha;
  }
  const endRender = new Date();
  console.log('Render time: ', endRender - startRender);

  data.set(newData8);
  ctxF.putImageData(imageData, 0, 0);
}

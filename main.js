"use strict";

document.addEventListener('DOMContentLoaded',init);

function init(){
  let canvasS = document.querySelector('#start');
  let canvasF = document.querySelector('#finish');
  let ctxS = canvasS.getContext('2d');
  let ctxF = canvasF.getContext('2d');

  let img = new Image();
  img.onload = function () {
    ctxS.drawImage(img, 0, 0);
    imgoof(ctxS, ctxF);
  };
  img.src = 'apple.jpg';
}

function imgoof(ctxS, ctxF){
  let imageData = ctxS.getImageData(0, 0, 512, 640);
  let data = imageData.data;//Uint8ClampedArray
  let buffer = data.buffer;
  let data32 = new Uint32Array(buffer); //Per-pixel access

  let newData = new ArrayBuffer(data.length);
  let newData32 = new Uint32Array(buffer);
  //a,b,g,r -> color bit order
  data32.forEach((pixel, i) => {
    let red = pixel & 255;  //red is far right of the 32 bits
    red += 100;
    red = red > 255 ? 255 : red; //If we go over 255 we'll start touching
    newData32[i] = (pixel | red);
  });

  data.set(newData32);
  ctxF.putImageData(imageData, 0, 0);
}

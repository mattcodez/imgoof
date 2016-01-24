"use strict";

document.addEventListener('DOMContentLoaded',init);

function init(){
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');

  let img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    imgoof(ctx);
  };
  img.src = 'apple.jpg';
}

function imgoof(ctx){
  let imageData = ctx.getImageData(0, 0, 512, 640);
  let data = imageData.data;//Uint8ClampedArray
  let buffer = data.buffer;
  let data32 = new Uint32Array(buffer); //Per-pixel access

  let newData = new ArrayBuffer(data.length);
  let newData32 = new Uint32Array(buffer);
  data32.forEach((pixel, i) => {
    newData32[i] = pixel;
  });

  data.set(newData32);
  ctx.putImageData(imageData, 0, 0);
}

"use strict";

document.addEventListener('DOMContentLoaded',init);

function init(){
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');

  let img = new Image();
  img.onload = function () {
    //draw background image
    ctx.drawImage(img, 0, 0);
    //draw a box over the top
    // ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
    // ctx.fillRect(0, 0, 500, 500);
  };
  img.src = 'apple.jpg';
}

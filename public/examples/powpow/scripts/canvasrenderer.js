"use strict";

function CanvasRenderer(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.explosions = [];
  this.shieldhits = [];
  this.renderCount = 0;
  this.darkColors = {};

  this.shotColors = [
    "#800000",
    "#ff0000",
    "#ff8000",
    "#ffff00",
    "#ffffff",
    "#ffff00",
    "#ff0000",
    "#ff8000"
  ];

  this.shieldColors = [
    "#00F",
    "#88F",
    "#FFF",
    "#88F"
  ];
}

CanvasRenderer.prototype.resize = function() {
  if (this.canvas.width != this.canvas.clientWidth ||
      this.canvas.height != this.canvas.clientHeight) {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    //tdl.log("new width:", this.canvas.width);
    //tdl.log("new height:", this.canvas.height);
  }
};

CanvasRenderer.prototype.begin = function(elapsedTime) {
  ++this.renderCount;
  this.shieldCount = this.renderCount % this.shieldColors.length;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderer.prototype.end = function(elapsedTime) {
  var ctx = this.ctx;
  if (this.explosions.length > 0) {
    if (this.explosions[0].timer <= 0) {
      this.explosions.shift();
    }
  }
  for (var ii = 0; ii < this.explosions.length; ++ii) {
    var explosion = this.explosions[ii];
    explosion.timer -= elapsedTime;
    var l = Math.max(0, explosion.timer / 1);
    var radius = (1 - l) * 50 + 10;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,0," + l + ")";
    ctx.translate(explosion.x, explosion.y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }
  if (this.shieldhits.length > 0) {
    if (this.shieldhits[0].timer <= 0) {
      this.shieldhits.shift();
    }
  }
  for (var ii = 0; ii < this.shieldhits.length; ++ii) {
    var shieldhit = this.shieldhits[ii];
    shieldhit.timer -= elapsedTime;
    var l = Math.max(0, shieldhit.timer / 1);
    var radius = (1 - (shieldhit.timer / 1)) * 10 + 5;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(128,128,255," + l + ")";
    ctx.translate(shieldhit.x, shieldhit.y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.restore();
  }
};

CanvasRenderer.prototype.drawShip = function(position, direction, color) {
  ships.drawShip(
      this.ctx, position[0], position[1], direction, color.canvasColor);
};

CanvasRenderer.prototype.drawOutlineShip = function(
    position, direction, color) {
  ships.drawOutlineShip(
      this.ctx, position[0], position[1], direction, color.canvasColor);
};

CanvasRenderer.prototype.drawTwoToneShip = function(
    position, direction, color) {
  var darkColor = this.darkColors[color.canvasColor];
  if (!darkColor) {
    var m = color.canvasColor.match(/rgb\((\d+),(\d+),(\d+)\)/)
    var darkColor = "rgb(" +
        Math.floor(parseInt(m[1]) / 2) + "," +
        Math.floor(parseInt(m[2]) / 2) + "," +
        Math.floor(parseInt(m[3]) / 2) + ")";
    this.darkColors[color.canvasColor] = darkColor;
  }
  ships.drawTwoToneShip(
      this.ctx, position[0], position[1], direction, color.canvasColor,
      darkColor);
};

CanvasRenderer.prototype.drawShield = function(position, direction, color) {
  var ctx = this.ctx;
  ctx.save();
  ctx.strokeStyle = this.shieldColors[this.shieldCount++ % this.shieldColors.length];
  ctx.translate(position[0], position[1]);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.arc(0, 0, 20, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.restore();
};

CanvasRenderer.prototype.drawShot = function(position, count) {
  var ctx = this.ctx;
  ctx.save();
  ctx.translate(position[0], position[1]);
  ctx.fillStyle = this.shotColors[count % this.shotColors.length];
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.lineTo(5, 0);
  ctx.lineTo(0, -5);
  ctx.lineTo(-5, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

CanvasRenderer.prototype.drawLeadMark = function(position, direction, color) {
  var ctx = this.ctx;
  ctx.save();
  ctx.translate(position[0] + 15, position[1] - 15);
  ctx.strokeStyle = color.canvasColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0,-10);
  ctx.lineTo(10, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(30, -30);
  ctx.stroke();
  ctx.restore();
};

CanvasRenderer.prototype.startExplosion = function(position, direction, color) {
  this.explosions.push({
    timer: 1,
    x: position[0],
    y: position[1]
  });
};

CanvasRenderer.prototype.startShieldHit = function(position) {
  this.shieldhits.push({
    timer: 0.5,
    x: position[0],
    y: position[1]
  });
};



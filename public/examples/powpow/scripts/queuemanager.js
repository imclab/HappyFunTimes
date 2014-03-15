"use strict";

/**
 * Manages the Queue of players waiting.
 */
function QueueManager(services, element) {
  this.services = services;
  this.launching_ = [];
  this.queue_ = [];
  this.timer_ = 0;

  this.plist = new PListManager(element);

//  this.rowHeight_ = 40;
//  this.canvas_ = $("queue-canvas");
//  this.ctx_ = this.canvas_.getContext("2d");
//  this.resize();
};

//QueueManager.prototype.resize = function() {
//  if (this.canvas_.width != this.canvas_.clientWidth ||
//      this.canvas_.height != this.canvas_.clientHeight) {
//    this.canvas_.width = this.canvas_.clientWidth;
//    this.canvas_.height = this.canvas_.clientHeight;
//    tdl.log("newq width:", this.canvas_.width);
//    tdl.log("newq height:", this.canvas_.height);
//  }
//};
//
//QueueManager.prototype.draw = function() {
//  this.resize();
//  var ctx = this.ctx_;
//  var canvas = this.canvas_;
//  var height = this.canvas_.height;
//  ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
//  // draw launching players
//  var y = 0;
//  var count = 0;
//  for (var ii = 0; y < height && ii < this.launching_.length; ++ii) {
//    var player = this.launching_[ii];
//    this.drawPlayer(player, y, count, true);
//    y += this.rowHeight_;
//    ++count;
//  }
//  // draw queued players.
//  for (var ii = 0; y < height && ii < this.queue_.length; ++ii) {
//    var player = this.queue_[ii];
//    this.drawPlayer(player, y, count, false);
//    y += this.rowHeight_;
//    ++count;
//  }
//};
//
//QueueManager.prototype.drawPlayer = function(player, y, count, launching) {
//  var ctx = this.ctx_;
//  var canvas = this.canvas_;
//  var width = this.canvas_.width;
//  ctx.fillStyle = count % 2 ? "#006" : "#00A";
//  var color = player.color.canvasColor;
//  if (launching) {
//    var cl = Math.floor(player.timer * 16);
//    switch (cl % 4) {
//    case 0:
//      color = "#f00";
//      break;
//    case 2:
//      color = "#ff0";
//    }
//  }
//  ctx.fillRect(0, 0, width, this.rowHeight_);
//  drawShip(
//      ctx,
//      this.rowHeight_ / 2,
//      y + this.rowHeight_ / 2,
//      player.direction,
//      color);
//};

QueueManager.prototype.draw = function() {
  this.plist.begin();
  this.setElements_(0, this.launching_, true);
  this.setElements_(this.launching_.length, this.queue_, false);
  this.plist.end();
};

QueueManager.prototype.setElements_ = function(index, players, launching) {
  for (var ii = 0; ii < players.length; ++ii) {
    this.plist.setElement(players[ii], launching, "");
  }
};

QueueManager.prototype.sendPlaceInQueue = function(player) {
  if (player.showPlaceInQueue) {
    player.send({
      cmd: 'queue',
      count: player.placeInQueue
    });
  }
};

QueueManager.prototype.sendPlaces = function() {
  for (var ii = 0; ii < this.queue_.length; ++ii) {
    var player = this.queue_[ii];
    player.placeInQueue = ii;
    this.sendPlaceInQueue(player);
  }
};

QueueManager.prototype.addToQueue = function(player) {
  player.placeInQueue = this.queue_.length;
  this.queue_.push(player);
  this.draw();
};

QueueManager.prototype.removeFromQueue = function(player) {
  for (var ii = 0; ii < this.queue_.length; ++ii) {
    if (this.queue_[ii].id == player.id) {
      this.queue_.splice(ii, 1);
      this.draw();
      this.sendPlaces();
      return;
    }
  }
  for (var ii = 0; ii < this.launching_.length; ++ii) {
    if (this.launching_[ii].id == player.id) {
      this.launching_.splice(ii, 1);
      this.draw();
      return;
    }
  }
};

QueueManager.prototype.process = function(elapsedTime) {
  if (this.timer_ > 0) {
    this.timer_ -= elapsedTime;
  } else {
    if (this.queue_.length > 0 &&
        g_activePlayers.length + this.launching_.length < this.services.globals.maxActivePlayers) {
      var player = this.queue_.shift()
      player.countdown();
      this.launching_.push(player);
      this.timer_ = 1;  // don't start another for at least 1 second.
      this.draw();
    }
  }
};



/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

var path = require('path');
var sprintf = require('sprintf-js').sprintf;

var list = function(args) {
  var gamedb = require('../../lib/gamedb');
  var gameList = gamedb.getGames();

  if (args.full) {
    console.log(JSON.stringify(gameList, undefined, "  "));
  } else {
    if (gameList.length > 0) {
      var longestIdLength = gameList.reduce(function(previous, current) {
        return Math.max(previous, current.originalGameId.length);
      }, 0);
      console.log(gameList.map(function(game) {
        return sprintf("id: %-" + (longestIdLength) + "s  dev: %s  path: %s",
            game.originalGameId,
            game.originalGameId != game.info.happyFunTimes.gameId ? "*" : " ",
            game.basePath);
      }).join("\n"));
    } else {
      console.log("no games installed");
    }
  }
};

exports.usage = {
  prepend: "list installed games",
  options: [
    { option: 'full', type: 'Boolean', description: "list entire contents of package for each game as json", },
  ]
};
exports.cmd = list;




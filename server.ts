import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import * as fs from "fs";

import { updateLanguageServiceSourceFile } from "typescript";

const app = express();
app.set("port", process.env.PORT || 3000);
var wordlist: string[] = [];
var broadcastTime: typeof setInterval;
var starttime: number;
class user {
  uname: string;
  team: number;
  constructor(Username: string) {
    var socket: any = 12;
    this.uname = Username;
  }
  setTeam(team: number) {
    this.team = team;
  }
}
var userList: user[] = [];
let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});
function fancyContain(searchFor: string, searchIn: string[]) {
  return searchIn.includes(searchFor);
}

function startTimer(sec: number) {
  var starttime = Date.now();
  var broadcastTime = setInterval(() => {
    io.emit("time", sec - (Date.now() - starttime)/1000);
    if ((Date.now() - starttime) < sec * 1000){
      clearInterval(broadcastTime);
    }
  }, 1000);
}

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
  console.log("a user connected");

  socket.on("word", (msg: string) => {
    if (fancyContain(msg, wordlist)) {
      socket.emit("err", "Word already in Word bank");
    } else {
      wordlist.push(msg);
      console.log(wordlist);
    }
  });

  socket.on("remove", (word: string) => {
    if (wordlist.includes(word)) {
      // shshh i cant find the real way to do this
      wordlist= wordlist.slice(0,wordlist.indexOf(word)).concat(wordlist.slice(wordlist.indexOf(word)+1,wordlist.length))
      socket.emit("err", "removed");
    } else {
      socket.emit("err", "not removed: not in list");
    }
  });

  socket.on("exist", (msg: string) => {
    console.log("User has been assigned name");
    console.log(msg);
    io.emit("addUser", msg);
  });
  socket.on("disconnect", () => {});
  socket.on("startGame", (owner:string) => {
    startTimer(60);
    
  });
});

const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});

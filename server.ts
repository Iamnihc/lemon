import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import * as fs from "fs";
import { updateLanguageServiceSourceFile } from "typescript";

const app = express();
app.set("port", process.env.PORT || 3000);
var wordlist: String[] = [];

class user {
  uname: String;
  team: number;
  constructor(Username: String) {
    var socket: any = 12;
    this.uname = Username;
  }
  setTeam(team: number) {
    this.team = team;
  }
}
var userList:user[] = []
let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});
function fancyContain(searchFor: String, searchIn: String[]) {
  return searchIn.includes(searchFor);
}
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
  console.log("a user connected");


  socket.on("word", (msg: String) => {
    if (fancyContain(msg, wordlist)) {
      socket.emit("err", "Word already in Word bank");
    } else {
      wordlist.push(msg);
      console.log(wordlist);
    }
  });


  socket.on("remove", (word: string) => {
    if (wordlist.includes(word)) {
      socket.emit("err", "removed");
    } else {
      socket.emit("err", "not removed: not in list");
    }
  });

  socket.on("exist", (msg: String) => {
    console.log("User has been assigned name");
    console.log(msg);
    io.emit("addUser", msg);
  });
  socket.on("disconnect", ()=>{
    
  });
});

const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});

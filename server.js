const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const websocket = require('ws');
const app = express();

const clientPath = `${__dirname}`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));
const server = http.createServer(app);

var rooms = [];
const io = socketio(server);
var main_users =0;
var nrusers = 0;
var userz = [];
var users = [];

io.on('connection',(sock) => {
  
  console.log('client'+ '\x1b[36m'+ ' connected' + '\x1b[0m');
  console.log('user with id ' + '\x1b[33m'+sock.id +'\x1b[0m');
 
  main_users++;
  sock.emit('message', 'Welcome to the chat room!'); 
  sock.emit('message', 'Welcome to the Battletanks chat');
  sock.on('adduser', function (name) {
    console.log('User introduced the name :' + '\x1b[35m'+name +'\x1b[0m');
    sock.emit('message', 'Welcome user [' + name + ']');
    userz.push(name);
    nrusers++;

    users[sock.id] = {
      inGame: null,
      player: null
    };
    
    console.log('Currently ' + '\x1b[31m'+userz.length +'\x1b[0m' + ' online');
    io.sockets.emit('message','[console]: Currently ' + nrusers + ' users online');
    
    sock.join('lobby');
    
    sock.on('shoot', function(coords){
      var game = users[socket.id].inGame, opponent;

      if(game !== null){
        if(game.curentPlayer === users[socket.id].player){
          opponent = game.curentPlayer === 0 ? 1: 0;

          checkGameOver(game);

            io.to(sock.id).emit('update', game.getState(users[sock.id].player, opponent));
            io.to(game.PlayerId(opponent)).emit('update', game.getState(opponent, opponent));
          }
        }
      });

    sock.on('leave', function(){
      if(users[sock.id].inGame !== null){
        leaveGame(sock);

        sock.join('lobby');
        joinWaitingList();
      }
    });
    sock.on('disconnect', function () {
      nrusers--;  

      leaveGame(sock);
      delete users[sock.id];

      console.log('Currently ' + '\x1b[31m'+nrusers +'\x1b[0m' + ' online');
      io.sockets.emit('message','[console]: Currently ' + nrusers + ' users online');
      console.log('client'+ '\x1b[35m'+ name +'\x1b[0m' + '\x1b[31m'+ ' disconnected' + '\x1b[0m');

    });

    joinWaitingList();
  });
  sock.on('message', (text) => {
      io.emit('message', text);
      console.log('User ' + sock.id + " said : " + text);
  });
  sock.on('message_main', (text) =>{
      io.emit('message_main', text);
      console.log('Main has' + main_users);
  });
  sock.emit('message_main', main_users);
  sock.on('disconnect', function () {
    main_users--;
  });
});

server.on('error', (err) => {
  console.error('Server error: ', err);
});

server.listen(80,'0.0.0.0', () => {
  console.log('App started on default');
})

var indexrouter = require("./js/extensionRemover");
app.get("", indexrouter);
app.get("/battletanks", indexrouter);
app.get("/game", indexrouter);

function joinWaitingList(){
  var players = users;
  var even = users.length;
  if(players.length == 2){
    var game = new Game(10);

    io.sockets.emit('join', "time to play");

    players[0].leave('lobby');
    players[1].leave('lobby');
    players[0].join('game1');
    players[1].join('game1');

    users[players[0].id].player = 0;
    users[players[1].id].player = 1;
    users[players[0].id].inGame = game;
    users[players[1].id].inGame = game;


    io.to(players[0].id).emit('update', game.getState(0));
    io.to(players[1].id).emit('update', game.getState(1));
  }
}

function leaveGame(socket){
  if(users[socket.id].inGame !== null){
    console.log('ID' + socket.id + 'left the game');

    socket.broadcast.to('game1').emit('notification', "opponent has left the game");
    if(!users[socket.id].inGame.check_win){
      checkGameOver(users[socket.id].inGame);
    }

    socket.leave('game' + users[socket.id].inGame.id);

    users[socket.id].inGame = null;
    users[socket.id].player = null;

    io.to(socket.id).emit('leave');
  }
}
function checkGameOver(game) {
  if(game.gameOver) {
    console.log(' Game ID ' + game.id + ' ended.');
    io.to(game.getWinnerId()).emit('gameover', true);
    io.to(game.getLoserId()).emit('gameover', false);
  }
}
// function getpplInroom(room) {
//   var clients = [];
//   for (var id in io.sockets.adapter.rooms[room]) {
//     clients.push(io.sockets.adapter.nsp.connected[id]);
//   }
//   return clients;}


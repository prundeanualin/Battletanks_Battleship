var usercount = 0;
var name = prompt("Enter your nickname you would like to use");

while (name == "")
{
    this.name = prompt("The user name can't be null. Please introduce another one");
}
if (name == "" || name == null)
{
    this.name = "Cocalarus noname";
}
    this.name = name;

const sock = io();



sock.emit('adduser', name);
// sock.emit('message', showPlayer);

const writeEvent = (text) => {
    //<ul> element
    const parent = document.querySelector('#realtimeupdate');
    //<li> element=
    const el = document.createElement('li');
    
    el.innerHTML = text;
    parent.appendChild(el);
};

const onFormSubmitted = (e) => {
    e.preventDefault();
    
    const input = document.querySelector('#chat');
    const text = input.value;
    input.value='';
    const finaltext = name + ": " + text;
    sock.emit('message', finaltext);
    console.log(text);
};

sock.on('message', writeEvent);

document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitted);

sock.on('connect', function(){
    console.log('Connected to server.');
    $('#disconnected').hide();
    $('#lobby').show();
    $('#game_panel').show();
});

sock.on('disconnect', function(){
console.log('Disconnected from server.');
$('#lobby').hide();
$('#game_panel').hide();
$('#disconnected').show();
});

sock.on('join', function(){
    $('#disconnected').hide();
    $('#lobby').show();
    $('#game_panel').show();
});
sock.on('update', function(State){
    Game.setTurn(State.turn);
    Game.shoot(State.x, State.y, State.player);
});

sock.on('notification', writeEvent);

sock.on('gameover', function(winner){
    Game.check_win();
});
sock.on('leave', function(){
    $('#game_panel').hide();
    $('#lobby').show();
})

function leaveRequest(e){
    e.preventDefault();
    sock.emmit('leave');
}

function sendShot(coords){
    sock.emmit('shot', coords);
}
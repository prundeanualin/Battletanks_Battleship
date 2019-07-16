var socket = new WebSocket("ws://localhost/splash.html");
socket.onmessage = function(event){
    document.getElementById("say").innerHTML = event.data;
}
socket.onopen = function()
{
    socket.send("plm");
    document.getElementById("say").innerHTML = "sending a message";
}
const websocket = new WebSocket('ws://192.168.1.71/game.html'),
panel = document.getElementById("panel"),
msg = document.getElementById("msg");

const sock = io();


websocket.addEventListener('open', () =>{
    console.log('someone connected');
});

function sendData(data){
    if (websocket.readyState === WebSocket.OPEN)
    {
        websocket.sendData(data);
    }
    else
        document.getElementById('panel').innerHTML = "not connected";
    
};



websocket.addEventListener('message', e => {
    let p = document.createElement("p");
    p.textContent = e.data;
    panel.appendChild(p);
});
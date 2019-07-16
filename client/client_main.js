const sock = io();

const writeEvent = (text) => {
    //<ul> element
    //<li> element=
    const el = document.getElementById('connections');
    
    el.innerHTML = text;
};

sock.on('message_main', writeEvent);
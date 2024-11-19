const WebSocket = require('ws').WebSocket;
const { time } = require('console');
const { type } = require('os');
const readline = require('readline');

class ChatClient{
  constructor(options){
    this.ws = new WebSocket(options.url);
    this.sessionId = options.sessionId || null;
    this.username = options.username;
  }

  init(){
    this.ws.on('open', () => this.onOpen());
    this.ws.on('message', (data) => this.onMessage(data));
    this.ws.on('error', console.error);

    
  }

  onOpen(){
    console.log('connected');
    this.ws.send(JSON.stringify({
      type: "options",
      data: {
        sessionId: this.sessionId,
        username: this.username
      }
    }));

    
  }
    
  onMessage(data){
    const parseData = JSON.parse(data);

    switch (parseData.type){
      case 'message':
          console.log(`${parseData.data.sender}>> ${parseData.data.message}`);
          break;
      case 'options':
          this.setOptions(parseData);
          break;
    default:
      console.log('unknown message type');
    }
  }
  

  setOptions(msgObject){
    this.sessionId=msgObject.sessionId;
    console.log('Your sessionId: ', this.sessionId);

  }

  send(data){
    const msgObject={
      type: 'message',
      sessionId: this.sessionId,
      data: data
    }

    this.ws.send(JSON.stringify(msgObject));
  }

}

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('What is your name?: ', (name) => {
    rl.close();
    init(name); 
  });


  const init = (name)=>{
    const client = new ChatClient({url: 'ws://localhost:8080', username: name});

    client.init();

    const chatInput = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    chatInput.on('line', (input) => {
      if (input.trim().toLowerCase() === 'exit') {
          chatInput.close();
      } else{
        client.send(input);
      }
    });
  }
import http from 'http';
import WebSocket from 'ws';

const CDP_PORT = 62205;

http.get(`http://127.0.0.1:${CDP_PORT}/json?t=${Date.now()}`, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const targets = JSON.parse(d);
    console.log('Target URL:', targets[0].url);
    console.log('Target title:', targets[0].title);
    
    const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
    let msgId = 0;
    
    ws.on('open', () => {
      // Check for contenteditable div (Gemini input)
      ws.send(JSON.stringify({id: ++msgId, method: 'Runtime.evaluate', params: {
        expression: `
          (() => {
            const ce = document.querySelector('[contenteditable="true"]');
            const ta = document.querySelector('textarea');
            const role_tb = document.querySelector('[role="textbox"]');
            const sendBtn = document.querySelector('[aria-label="Send message"]');
            return JSON.stringify({
              contenteditable: ce ? ce.innerText.substring(0,100) : null,
              textarea: !!ta,
              role_textbox: role_tb ? role_tb.innerText.substring(0,100) : null,
              send_button: !!sendBtn,
              send_button_type: sendBtn ? sendBtn.tagName : null
            });
          })()
        `
      }}));
      
      // Check body text (first 500 chars)
      ws.send(JSON.stringify({id: ++msgId, method: 'Runtime.evaluate', params: {
        expression: 'document.body.innerText.substring(0, 500)'
      }}));
      
      setTimeout(() => ws.close(), 3000);
    });
    
    ws.on('message', data => {
      const msg = JSON.parse(data.toString());
      if (msg.id && msg.result?.result?.value) {
        console.log(`Result ${msg.id}:`, msg.result.result.value);
      }
    });
  });
});

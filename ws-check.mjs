import http from 'http';

http.get('http://127.0.0.1:62205/json?t=' + Date.now(), r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const targets = JSON.parse(d);
    console.log('URL:', targets[0].url);
    console.log('Title:', targets[0].title);
    
    // Use fetch via HTTP instead of ws
    const wsUrl = targets[0].webSocketDebuggerUrl;
    console.log('WS URL:', wsUrl.substring(0, 60));
  });
});

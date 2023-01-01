const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let retFile = './client/public'
    if(req.url === '/'){
        retFile += '/page.html';
        res.write(fs.readFileSync(retFile))
        res.end();
    } 
    else if(req.url === '/favicon.ico'){
        res.end();
    }
    else{
        try{
            retFile += req.url;
            res.write(fs.readFileSync(retFile))
            res.end();
        }
        catch{
            res.end();
        }
    }
});

server.listen(3000, () => {
    console.log('KeypadSimualator 서버를 실행합니다. 커맨드 창을 닫거나, Ctrl+C를 누르면 종료됩니다.');
})


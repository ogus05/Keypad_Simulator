const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer((req, res) => {
    let retFile = './client/public';
    if(req.url === '/'){
        retFile += '/page.html';
        res.write(fs.readFileSync(retFile))
        res.end();
    }
    else{
        try{
            retFile += req.url;
            res.write(fs.readFileSync(retFile))
        }
        catch{
        }
        finally{
            res.end();
        }
    }
});

server.listen(port, () => {
    console.log(`KeypadSimualator 서버를 실행합니다. localhost:${port}를 통해 접속 가능합니다.`);
    console.log('커맨드 창을 닫거나, Ctrl+C를 누르면 종료됩니다.')
})


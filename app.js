//这是运行在node.js上的
const WebSocket = require('ws');
var express = require('express');
var app = express();


const wss = new WebSocket.Server({
    port: 3030,
    verifyClient: yan//验证要不要给连接
})

function yan(info) {
    let url = info.req.url
    // let i = url.search(6);
    // if (i<0){
    //     console.log('拒绝连接');
    //     return false;
    // }
    console.log('通过连接' + url);
    return true;
}

let user = {};//存储连接用户
let online = 0;//存储在线人数
let conws = {}
wss.on('connection', function (ws, req) {
    conws = ws
    online = wss._server._connections;
    console.log('当前在线' + online + '个连接');
    //ws.send('当前在线' + online+'个连接');
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send('当前在线' + online + '个连接');
        }
    });
    let i = req.url;//提取网址参数
    let m = i.match(/(?<=\?)[^:]+?(?=:|$)/);    //提取我是谁,这部分代码只有第一次连接的时候运行,如果后面连接的m值相同,前面的连接会被覆盖身份
    if (m) {
        user[m] = ws;
    }
    ;
    let u = i.match(/(?<=:).+?$/);              //提取发给谁
    ws.on('message', function (msg) {
        console.log('收到' + i + '的消息：' + msg);
        if (msg === 111) {
            console.log("chufa")
            online = wss._server._connections;
            console.log('当前在线' + online + '个连接');
            //ws.send('当前在线' + online+'个连接');
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send('当前在线' + online + '个连接');
                }
            });
        }
        // ws.send(req.headers['sec-websocket-key'])
        // ws.send(req.url)
        if (u) {
            if (user[u]) {
                if (user[u].readyState === 1) {
                    user[u].send(msg);
                    ws.send('发送成功');
                } else {
                    ws.send('对方掉线');
                }
            } else {
                ws.send('找不到对象');
            }
        } else {//广播
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(msg);
                }
            });
        }

        if (online != wss._server._connections) {
            online = wss._server._connections;
            ws.send('当前在线' + online + '个连接');
        }
        // ws.send(req.headers.origin)
        // ws.send(JSON.stringify(Array.from(wss.clients)))
        // ws.send(JSON.stringify(ws))
        // ws.send(JSON.stringify(req))
    })
})

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//接口
app.get('/send', function (req, res) {
    //console.log('请求了接口地址',req,res)
    //console.log(wss.clients)
    //console.log(req.query,req.params)
    wss.clients.forEach(function each(client) {
        client.send(req.query.message);
    });
    res.status(200),
        res.json({message: '成功'})
});

//配置服务端口
var server = app.listen(3031, function () {

    var host = server.address().address;

    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})

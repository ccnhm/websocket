# websocket
基于本地node环境搭建的单人或多人聊天，管理员可主动下发消息

1，安装 
npm install

2，运行websocket服务器 
node app.js
此时启动了两个端口侦听服务
ws://localhost:3030是websocket地址
http://localhost:3031/send?message=这里是自定义消息   这个是抛出的发送消息的接口（可随时调用该接口来对所有人主动发送消息）

3，运行INDEX.html 客户端
（记得在服务器环境中运行）

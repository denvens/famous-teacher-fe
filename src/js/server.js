var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var port = require('../../config').PORT;
var server = http.createServer((req, res) => {
    var urlObj = url.parse(req.url);
    var urlPathname = urlObj.pathname;
    var filePathname = path.join(__dirname, "../../dist", urlPathname);
    fs.readFile(filePathname, (err, data) => {
        if (err) {
            res.writeHead(404,{
                "Content-Type": "text/html;charset=utf-8"
            });
            res.write("404 - 未找到文件!请检查地址是否正确！");
            res.end();
        } else {
            res.writeHead(200);
            res.write(data);
            res.end();
        }
    })
});

server.listen(port,()=>{
    console.log('success')
})
var http = require('http'),
    url = require('url'),
    path = require('path'),
    portfinder = require('portfinder'),
    fs = require('fs')

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"}

var fallbackPaths = [ "merges/android/", "platforms/android/assets/www/", "www/"]


var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname
    var filename = path.join(process.cwd(), unescape(uri));
    var stats;

    var foundIt = false
    var i = 0
    for (i = 0; i < fallbackPaths.length; i++) {
        try {
            filename = path.join(process.cwd(), fallbackPaths[i], unescape(uri))
            stats = fs.lstatSync(filename)
            foundIt = true
            break
        } catch (e) {
        }
    }
    if (!foundIt) {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.write('404 Not Found\n')
        res.end()
        return
    }


    if (stats.isFile()) {
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]]
        res.writeHead(200, {'Content-Type': mimeType})

        var fileStream = fs.createReadStream(filename)
        fileStream.pipe(res)
    } else if (stats.isDirectory()) {
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.write('Index of ' + uri + '\n')
        res.end()
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'})
        res.write('500 Internal server error\n')
        res.end()
    }

})

portfinder.basePort = 8080;
portfinder.getPort(function (err, port) {
    if (err) throw err;
    console.log("Listening on port: " + port)
    server.listen(port)
})




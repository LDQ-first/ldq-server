const http = require('http')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const conf = require('./config/defaultConfig')

const server = http.createServer((req, res) => {
  const url = req.url
  const filePath = path.join(conf.root, url)
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end(`${filePath} is not a directory or file`)
      return
    }
    if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      /* fs.readFile(filePath, (err, data) => {
        res.end(data)
      }) */
      fs.createReadStream(filePath).pipe(res)
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end(files.join(','))
      })
    }
  } )

 /*  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html') */
  /* res.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      Hello Node HTTP World
    </body>
    </html>
  `) */
 /*  res.end(filePath) */
})

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`
  console.info(`Server started at ${chalk.green(addr)}`)
})
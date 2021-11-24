const http = require('http')

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)
  res.statusCode = 418
  res.end(`i'm a teapot`)
})

server.listen(process.env.PORT || 3137, () => {
  console.log(`listening on ${server.address().port}`)
})

const { createProxyMiddleware: proxy } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(proxy('/user', { target: 'http://127.0.0.1:8000/' }))
  app.use(proxy('/home/*', { target: 'http://0.0.0.0:8000/' }))
  app.use(proxy('/share/*', { target: 'http://0.0.0.0:8000/' }))
}
 
   
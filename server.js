var serverFactory = require('spa-server');

var server = serverFactory.create({
    path: './',
    port: 7999,
    fallback: {
        'text/html' : 'index.html'
    }
});

server.start();
 
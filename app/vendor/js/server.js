var md5 = require('./node_modules/MD5'),
    hapi = require('./node_modules/hapi'),
    app = new hapi.Server(),
    users = {},
    messages = [];

app.connection({ port: 7770 }); 

app.route({
    method: 'GET',
    path: '/api/',
    handler: function (request, reply) {
        reply({users: users, messages: messages});
    }
});

app.route({
    method: 'GET',
    path: '/vendor/{param*}',
    handler: {
        directory: {
            path: './public/vendor/'
        }
    }
});

app.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file('./public/index.html');
    }
});


app.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: function (request, reply) {
        reply.file('./public/favicon.ico');
    }
});

app.start();

var io = require('./node_modules/socket.io').listen(app.listener);


io.sockets.on('connection', function(socket){
    var me = false;

    socket.on('newmsg', function(message){
        message.user = me;
        message.time = time();
        if(messages.length > 10){
            messages.shift();
        }
        messages.push(message);
        io.sockets.emit('newmsg', message);
    });

    socket.on('login', function(user){
        var md5Mail = md5(user.mail.toLowerCase()),
            error = null;

        for(var k in users){
            if(k == md5Mail){
                error = 'This email is already in use';
            }
        }

        if(error !== null){
            socket.emit('logerr', error);
        }else{
            me = user;
            me.id = md5Mail;
            me.avatar = '//gravatar.com/avatar/' + me.id + '?s=50';
            socket.emit('logged');
            users[me.id] = me;
            io.sockets.emit('newusr', me);
        }
    });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disusr', me);
    });
});
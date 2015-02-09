(function () {
    // Display IP
    var os = require('os');
    var interfaces = os.networkInterfaces();
    var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                       addresses.push(address.address);
                }
            }
        }
    $('#ip').text(addresses[0]);

    // Variables
    var users = {},
        messages = [],
        hapi = require('hapi'),
        app = new hapi.Server();
    
    // Functions
    var getTime = function (){
      var date = new Date(),
        h = date.getHours(),
        m = date.getMinutes();

      return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }

    var displayInfo = function (user, message) {
      var div = $('<li>');
      $('<span>').text('At ' + getTime() + ', ').appendTo(div);
      $('<span>').text(getShiny(user)).addClass('color').appendTo(div);
      $('<span>').text(message).appendTo(div);
      div.appendTo('#infos');
    }

    var displayMessage = function (user, message) {
      var div = $('<li>');
      $('<span>').text('At ' + getTime() + ', ').appendTo(div);
      $('<span>').text(getShiny(user)).addClass('color').appendTo(div);
      $('<span>').text(' says "' + message + '".').appendTo(div);
      div.appendTo('#infos');
    }

    var getShiny = function (string){
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
    
    // Server
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
        path: '/{param*}',
        handler: {
            directory: {
                path: './'
            }
        }
    });

    app.start()

    // Socket.io
    var io = require('socket.io')(app.listener);
    io.sockets.on('connection', function(socket){
        var me = false;

        socket.on('newmsg', function(message){
            message.user = me;
            message.time = getTime();
            if(messages.length > 10){
              messages.shift();
            }
            displayMessage(me.username, message.message)
            message.message = twttr.txt.autoLink(twttr.txt.htmlEscape(message.message));
            messages.push(message);
            io.sockets.emit('newmsg', message);
        });

        socket.on('login', function(user){
          var md5User = require('MD5')(user.username.toLowerCase()),
          error = null;

          for(var k in users){
              if(k == md5User){
                error = 'This username is already in use';
              }
          }

          if(error !== null){
            socket.emit('logerr', error);
          }else{
           me = user;
           me.id = md5User;
           me.avatar = '//gravatar.com/avatar/' + me.id + '?s=50';
           socket.emit('logged');
           users[me.id] = me;
           displayInfo(me.username,' is connected.');
           io.sockets.emit('newusr', me);
        }
      });

        socket.on('disconnect', function(){
            if(!me){
                return false;
            }
           delete users[me.id];
           io.sockets.emit('disusr', me);
           displayInfo(me.username, ' has left.');
        });
    });

})(jQuery);
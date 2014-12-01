(function () {

    window.ondragover = window.ondrop = function(e) {
      e.preventDefault();
      return false;
    }

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

    var users = new Object(),
    messages = new Array();

    // Server
    var app = require('express')();
    var serveStatic = require('serve-static');

    app.use(serveStatic('./'));

    app.get('/users', function(req, res) {
            res.json(users);
    });

    app.get('/messages', function(req, res) {
            res.json(messages);
    });

    var server = require('http').createServer(app)
    server.listen(1337);

    // Socket.io
    var io = require('socket.io')(server);
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

    function getTime(){
      var date = new Date(),
        h = date.getHours(),
        m = date.getMinutes();

      return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }

    function displayInfo(user, message) {
      var div = $('<li>');
      $('<span>').text('At ' + getTime() + ', ').appendTo(div);
      $('<span>').text(getShiny(user)).addClass('color').appendTo(div);
      $('<span>').text(message).appendTo(div);
      div.appendTo('#infos');
    }

    function displayMessage(user, message) {
      var div = $('<li>');
      $('<span>').text('At ' + getTime() + ', ').appendTo(div);
      $('<span>').text(getShiny(user)).addClass('color').appendTo(div);
      $('<span>').text(' says "' + message + '".').appendTo(div);
      div.appendTo('#infos');
    }

    function getShiny(string){
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }

})(jQuery);
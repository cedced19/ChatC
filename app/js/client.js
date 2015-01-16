(function () {
                    var msg = $('#msgtpl').html(),
                          lastsender = false,
                          currentusr = '',
                          uri = 'http://' + window.location.host,
                          socket = io.connect(window.location.host);

                      $('#msgtpl').remove();

                      $('#loginform').submit(function(event){
                      event.preventDefault();
                      var username = $('#username').val().replace(/ /g, '');
                      if($('username').val() == ''){
                            sweetAlert('Oops...', 'You must enter a nickname!', 'error');
                      }else{
                            socket.emit('login', {username: $('#username').val()});
                      };
                      return false;
                      });

                     $.getJSON(uri + '/users', function (users) {
                      for (var user in users){
                        displayUser(users[user]);
                      }
                     });


                     $.getJSON(uri + '/messages', function (messages) {
                      for (var message in messages){
                        displayMessage(messages[message]);
                      }
                    });



            $('#msgform').submit(function(event){
                      event.preventDefault();
                      var message = $('#message').val().replace(/ /g, '');
                      if(message == ''){
                          sweetAlert('Oops...', 'You must enter a  message!', 'error');
                        }else{
                          socket.emit('newmsg', {message : $('#message').val() });
                          $('#message').val('');
                        };
                        $('#message').focus();
            });

            socket.on('newmsg', function(message){
                      displayMessage(message);
            });

            socket.on('logged', function(){
                      $('#loginform').css({'display': 'none'});
                      currentusr = $('#username').val();
                      $('#main').css({'display': 'block'});
                      $('#message').focus();
            });

            socket.on('newusr', function(user){
                      displayUser(user);
            });

            socket.on('logerr', function(message){
                      sweetAlert('Oops...', message, 'error');
            });

            socket.on('disusr', function(user){
                $('#'+user.id).slideUp(100, function(){
                   $('#'+user.id).remove();
                });
            });

            function displayUser (user) {
               if(user.username == currentusr){
                        user.username = 'Me';
               }
               $('#users').append('<li id="'+ user.id +'">'+user.username.charAt(0).toUpperCase() + user.username.substring(1).toLowerCase() +'</li>');
            }

            function displayMessage (message) {
                if(message.user.username == currentusr){
                        message.user.username = 'Me';
                }

                    $('#messages').append('<div class="sep"></div>');
                    $('#messages').append( '<div class="message">' + Mustache.render(msg, message) + '</div>' );
                    $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 500);
            }

            })(jQuery);
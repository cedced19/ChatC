$(function() {
    var Menu = function (copyLabel) {
        var gui = require('nw.gui'), 

            menu = new gui.Menu(), 

            copy = new gui.MenuItem({
                label: copyLabel,
                click: function() {
                    document.execCommand('copy');
                }
            });

        menu.append(copy);
        
        return menu;
    }

    var menu = new Menu('Copy');


    $(document).on('contextmenu', function(e) {
        e.preventDefault();
        menu.popup(e.originalEvent.x, e.originalEvent.y);
    });
    
    $('#ip').text('http://' + ip() + ':7770');
});
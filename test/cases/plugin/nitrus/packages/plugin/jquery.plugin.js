;
// ![description]

<!js 
    // multiple javascript code here
    var funcs = ['foo', 'bar'];
!>

(function( $ ) {
  $.fn.![pluginname] = function() {

    <!js for(var i=0; i < funcs.length; i++) {!>
    $.fn.!!funcs[i] = function() {
        return $('.!!funcs[i]');
    };
    <!js } !>

  };
})( jQuery );
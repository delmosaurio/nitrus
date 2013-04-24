<!js 
  var props =  context.current.properties;
!>
define('model.![current.name]',
    ['jquery', 'ko'],
    function ($, ko) {
    	var self = this;

    	<!js for(var i=0; i < props.length; i++ ) {!>
		self.!!props[i].name = ko.observable();
    	<!js }!>

    	return self;
	});
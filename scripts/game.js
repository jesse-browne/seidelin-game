/**
 * Module for application logic such as 
 * switching between game states
 */

jewel.game = (function() {
	var dom = jewel.dom,
	    $   =  dom.$;
	
	// hide active screen (if exists) and show screen with specified id
	function showScreen(screenId) {
		
		var activeScreen = $('#game .screen.active')[0],
	        screen = $('#' + screenId)[0];
		
		if (activeScreen) {
			dom.removeClass(screen, 'active');
		}
		
		dom.addClass(screen, 'active');
	}   
	
	// expose public method
	return {
		showScreen : showScreen
	};
	
}) ();
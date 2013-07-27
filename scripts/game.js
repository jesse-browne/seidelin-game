/**
 * Module for application logic such as 
 * switching between game states
 */

jewel.game = (function() {
	var dom = jewel.dom,
	    $   =  dom.$;
	
	function setup() {
		// disable native touchmove behaviour to prevent overscroll
		dom.bind(document, 'touchmove', function(event) {
			event.preventDefault();
		});
		
		// hide address bar on android devices
		if (/Android/.test(navigator.userAgent)) {
			$('html')[0].style.height = '200%';
			setTimeout(function() {
				window.scrollTo(0,1);
			}, 0);
		}
	}
	
	// hide active screen (if exists) and show screen with specified id
	function showScreen(screenId) {
		
		var activeScreen = $('#game .screen.active')[0],
	        screen = $('#' + screenId)[0];
		
		if (activeScreen) {
			dom.removeClass(activeScreen, 'active');
		}

		// get screen parameters
		var args = Array.prototype.slice.call(arguments, 1);
		
		// run screen module
		jewel.screens[screenId].run.apply(jewel.screens[screenId], args);
		
		// display screen
		dom.addClass(screen, 'active');
	}   
	
	// expose public method
	return {
		showScreen : showScreen,
		setup : setup
	};
	
}) ();
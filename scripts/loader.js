/**
 * Loader file for Seidelin game
 */

var jewel = {
		screens : {}
};

// wait until document is loaded
window.addEventListener('load', function() {
	
	console.log('Add iOS standalone test ...');
	
	Modernizr.addTest('standalone', function() {
		return (window.navigator.standalone != false);
	})
	
	console.log('Begin loading files stage 1 ...');
	
	// begin dynamic loading stage 1
	Modernizr.load([
	    {
	    	// always load these files    	
	    	load : [
	    	    'scripts/sizzle.js',
	    	    'scripts/dom.js',
	    	    'scripts/game.js'
	    	]
	    },{
	    	test: Modernizr.standalone,
	    	yep: 'scripts/screen.splash.js',
	    	nope: 'scripts/screen.install.js',
	    	complete: function() {
	    		if (Modernizr.standalone) {
	    			jewel.game.showScreen('splash-screen');
	    		} else {
	    			jewel.game.showScreen('install-screen');
	    		}
	    	}
	    	
	    	// when all files finished loading and executing show splash screen
	    	complete : function() {
	    		
	    		console.log("All files loaded!");
	    		jewel.game.showScreen('splash-screen');
	    		
	    	}
	    }   
	]);
	
	// loading stage 2
	console.log('Loading files stage 2 ...');
	
	if (Modernizr.standalone) {
		Modernizr.load([
		    {
		        load: ['scripts/screen.main-menu.js']        	
		    }
		]);
	}

}, false);

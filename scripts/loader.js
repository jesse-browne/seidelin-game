/**
 * Loader file for Seidelin game
 */

var jewel = {};

// wait until document is loaded
window.addEventListener("load", function() {
	
	console.log("Begin loading files ...");
	
	// begin dynamic loading
	Modernizr.load([
	    {
	    	// always load these files    	
	    	load : [
	    	    "scripts/sizzle.js",
	    	    "scripts/dom.js",
	    	    "scripts/game.js"
	    	],
	    	
	    	// when all files finished loading and executing show splash screen
	    	complete : function() {
	    		
	    		console.log("All files loaded!");
	    		jewel.game.showScreen('splash-screen');
	    		
	    	}
	    }   
	]);

}, false);

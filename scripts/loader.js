/**
 * Loader file for Seidelin game
 */

var jewel = {};

// wait until document is loaded
window.addEventListener("load", function() {
	
	// begin dynamic loading
	Modernizr.load([
	    {
	    	// always load these files
	    	// console.log("Begin loading files ...");
	    	load : [
	    	    "scripts/sizzle.js",
	    	    "scripts/dom.js",
	    	    "scripts/game.js"
	    	],
	    	
	    	// when all files finished loading and executing
	    	complete : function() {
	    		// console.log("All files loaded!");
	    	}
	    }   
	]);

}, false);

/**
 * Loader file for Seidelin game
 */

var jewel = {
		screens : {},
		settings : {
			rows : 8,
			cols : 8,
			basescore : 100,
			numJewelTypes : 7
		}
};

// wait until document is loaded
window.addEventListener('load', function() {
	
	console.log('Run iOS standalone test ...');
	var ios_test = 'Result: ' + (window.navigator.standalone != false);
	console.log(ios_test);

	Modernizr.addTest('standalone', function() {
		return (window.navigator.standalone != false);
	});
	
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
	    	complete : function() {
	    		jewel.game.setup();
	    		if (Modernizr.standalone) {
	    			jewel.game.showScreen('splash-screen');
	    		} else {
	    			jewel.game.showScreen('install-screen');
	    		}
	    	}
	    }   
	]);
	
	// loading stage 2
	console.log('Loading files stage 2 ...');
	
	if (Modernizr.standalone) {
		Modernizr.load([
		    {
		        load: [
		            'scripts/screen.main-menu.js',
		            'scripts/board.js'
		        ]      	
		    }
		]);
	}
	console.log('All files loaded!');
	
}, false);

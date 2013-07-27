/**
 * Loader file for Seidelin game
 */

var jewel = {
		screens : {},
		settings : {
			rows : 8,
			cols : 8,
			basescore : 100,
			numJewelTypes : 7,
			images : {}
		}
};

// wait until document is loaded
window.addEventListener('load', function() {
	
	// determine jewel size
	var JewelProto = document.getElementById('jewel-proto'),
	    rect = jewelProto.getBoundingClientRect();
	
	jewel.settings.jewelSize = rect.width;
	
	console.log('Run iOS standalone test ...');
	var ios_test = 'Result: ' + (window.navigator.standalone != false);
	console.log(ios_test);

	Modernizr.addTest('standalone', function() {
		return (window.navigator.standalone != false);
	});
	
    // extend yepnope
	yepnope.addPrefix('preload', function(resource) {
		resource.noexec = true;
		return resource;
	});
	
	var numPreload = 0,
	    numLoaded =  0;
	    
	yepnope.addPrefix('loader', function(resource) {
		console.log('Loading: ' + resource.url);
		var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
		resource.noexec = isImage;
		
		numPreLoad++;
		resource.autoCallback = function(e) {
			console.log('Finished loading: ' + resource.url);
			numLoaded++;
			if (isImage) {
				var image = new Image();
				image.src = resource.url;
				jewel.images[resource.url] = image;
			}
		};
		return resource;
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
	    	test : Modernizr.standalone,
	    	yep : 'scripts/screen.splash.js',
	    	nope : 'scripts/screen.install.js',
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
		        load : [
		            'scripts/screen.main-menu.js'
		        ]
		    },{
		    	test :   Modernizr.webworkers,
		    	yep :   [
		    	    'scripts/board.worker-interface.js',
		    	    'preload!scripts/board.worker.js'
		    	],
		    	nope :  'scripts/board.js'
		    }
		]);
	}
	console.log('All files loaded!');
	
}, false);

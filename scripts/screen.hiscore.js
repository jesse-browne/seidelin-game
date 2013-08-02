/**
 * Module for High Score screen
 */

jewel.screens['hiscore'] = (function() {
	var dom = jewel.dom,
	    $ = dom.$,
	    game = jewel.game,
	    storage = jewel.storage,
	    numScores = 10,
	    firstRun = true;
	
	function setup() {
		var backButton = $('#hiscore footer button[name=back]')[0];
		dom.bind(backButton, 'click', function(e) {
			game.showScreen('main-menu');
		});
	}
	
	function run(score) {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		populateList();
		if (typeof score != 'undefined') {
			enterScore(score);
		}
	}
	
	function populateList() {
		
	}
	
	function enterScore(score) {
		
	}
	
	return {
		run : run
	};
	
})();
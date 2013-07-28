/**
 * Game screen module
 */

jewel.screens['game-screen']= (function() {
	var board = jewel.board,
	    display = jewel.display;
	
	function run() {
		board.initialize(function() {
			display.initialize(function() {
				display.redraw(board.getBoard(), function() {
					console.log('Do nothing for now');
					// do nothing for the moment
				});
			});
		});
	}
	
	return {
		run : run
	};
})();
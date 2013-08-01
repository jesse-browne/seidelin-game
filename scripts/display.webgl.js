/**
 * WebGL display module 
 */

jewel.display = (function() {
	var animations = [],
	    previousCycle,
	    firstRun = true,
	    jewels;
	
	function initialize(callback) {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		requestAnimationFrame(cycle);
		callback();
	}
	
	function setup() {
		
	}
	
	function setCursor() {}
	function levelUp() {}
	function gameOver() {}
	function redraw() {}
	function moveJewels() {}
	function removeJewels() {}
	
	return {
		initialize :    initialize,
		redraw :        redraw,
		setCursor :     setCursor,
		moveJewels :    moveJewels,
		removeJewels :  removeJewels,
		refill :        redraw,
		levelUp :       levelUp,
		gameOver :      gameOver
	};
	
})();
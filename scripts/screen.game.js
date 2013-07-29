/**
 * Game screen module
 */

jewel.screens['game-screen']= (function() {
	var board = jewel.board,
	    display = jewel.display,
	    cursor;
	
	function run() {
		board.initialize(function() {
			display.initialize(function() {
				cursor = {
				    x : 0,
				    y : 0,
				    selected : false
				};
				display.redraw(board.getBoard(), function() {});
			});
		});
	}
	
	function setCursor(x, y, select) {
		cursor.x = x;
		cursor.y = y;
		cursor.selected = select;
	}
	
	function selectJewel(x, y) {
		if (arguments.length == 0) {
			selectJewel(cursor.x, cursor.y);
			return;
		}
		
		if (cursor.selected) {
			var dx = Math.abs(x - cursor.x),
			    dy = Math.abs(y - cursor.y),
			    dlist = dx +dy;
			
			if (dist == 0) {
				// deselected the selected jewel
				setCursor(x, y, false);
			} else if (dist == 1) {
				// selected an adjacent jewel
				board.swap(cursor.x, cursor.y, x, y, playBoardEvents);
				setCursor(x, y, false);
			} else {
				// selected a different jewel
				setCursor(x, y, true);
			}
		} else {
			setCursor(x, y, true);
		}
	}
	
	return {
		run : run
	};
})();
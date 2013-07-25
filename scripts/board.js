/**
 * Data model of the gameboard 
 */

jewel.board = (function() {
	
	var settings,
	    jewels,
	    cols,
	    rows,
	    basescore,
	    numJewelTypes;
	
	function randomJewel() {
	    return Math.floor(Math.random() * numJewelTypes);
	}	
	
	function getJewel(x, y) {
		if ( ( x < 0 ) || ( x > cols -1 ) || ( y < 0 ) || ( y > rows - 1 ) ) {
			return -1;
		} else {
			return jewels[x][y];
		}
	}
	
	function fillBoard() {
		var x, y,
		    type;
		jewels = [];
		for (x = 0; x < cols; x++) {
			jewels[x] = [];
			for (y = 0; y < rows; y++) {
				type = randomJewel();
				while ((type === getJewel(x - 1, y) && 
						type === getJewel(x - 2, y)) ||
					   (type === getJewel(x, y - 1) && 
						type === getJewel(x, y - 1))) {
					type = randomJewel();	
				}
				jewels[x][y] = type;
			}
		}
	}
	
	function initialize() {
		settings =       jewel.settings;
		cols =           settings.cols;
		rows =           settings.rows;
		basescore =      settings.basescore;
		numJewelTypes =  settings.numJewelTypes;
		fillBoard();
		callback();
	}
	
	function print() {
		var str = '';
		for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
				str += getJewel(x, y) + ' ';
			}
			str += '\r\n';
		}
		console.log(str);
	}
	
	return {
		initialize : initialize,
		print : print
	};
	
})();
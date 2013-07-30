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
		if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
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
						type === getJewel(x, y - 2))) {
					type = randomJewel();	
				}
				jewels[x][y] = type;
			}
		}
		
		if ( !hasMoves() ) {
			fillBoard();
		}
	}
	
	
	function checkChain(x, y) {
		// returns the number of jewels in the longest chain that includes (x, y)
		var type = getJewel(x,y),
		    left = 0,
		    right = 0,
		    down = 0,
		    up = 0;
		
		// look right
		while ( type === getJewel(x + right + 1, y) ) {
			right++;
		}
		
		// look left
		while ( type === getJewel(x - left - 1, y) ) {
			left++;
		}
		
		// look up
		while ( type === getJewel(x, y + up + 1) ) {
			up++;
		}
		
		// look down
		while ( type === getJewel(x, y - down - 1) ) {
			down++;
		}
		
		return Math.max(left + 1 + right, up + 1 + down);
	}

	function canSwap(x1, y1, x2, y2) {
		// returns true if (x1,y1) can be swapped with (x2,y2)
		var type1 = getJewel(x1, y1),
		    type2 = getJewel(x2, y2),
		    chain;
		
		if ( !isAdjacent(x1, y1, x2, y2) ) {
			return false;
		}
		
		// temporarily swap
		jewels[x1][y1] = type2;
		jewels[x2][y2] = type1;
		
		chain = ( checkChain(x2, y2) > 2 || checkChain(x1, y1) > 2 );
		
		// swap back
		jewels[x1][y1] = type1;
		jewels[x2][y2] = type2;		
		
		return chain;
	}
	
	function isAdjacent(x1, y1, x2, y2) {
		// returns true if (x1,y1) is adjacent to (x2,y2)
		var dx = Math.abs(x1 - x2),
		    dy = Math.abs(y1 - y2);
		
		return ( dx + dy === 1);
	}
	
	function getChains() {
		// returns 2d map of chain-lengths
		var x, y, 
		    chains = [];
		
		for (x = 0; x < cols; x++) {
			chains[x] = [];
			for (y = 0; y < rows; y++) {
				chains[x][y] = checkChain(x, y);
			}
		}
		
		return chains;
	}

	function getBoard() {
		// create a copy of board
		var copy = [],
		    x;
		
		for (x = 0; x < cols; x++) {
			copy[x] = jewels[x].slice(0);
		}
		
		return copy;
	}
	
	function hasMoves() {
		// returns true if at least one move is possible
		for (var x = 0; x < cols; x++) {
			for (var y = 0; y < rows; y++) {
				if ( canJewelMove(x, y) ) {
					return true;
				}
			}
		}
		return false;
	}
	
	function check(events) {
		var chains =     getChains(),
		    hadChains =  false,
		    score =      0,
		    removed =    [],
		    moved =      [],
		    gaps =       [];
		
		for (var x = 0; x < cols; x++) {
			gaps[x] = 0;
			for (var y = rows - 1; y >= 0; y--) {
				if (chains[x][y] > 2) {
					hadChains = true;
					gaps[x]++;
					removed.push({
						x : x,
						y : y,
						type : getJewel(x, y)
					});
					
					// add points to score
					score += baseScore * Math.pow( 2, ( chains[x][y] - 3) );
					
				} else if (gaps[x] > 0) {
					moved.push({
						toX : x,
						toY : y + gaps[x],
						fromX : x,
						fromY : y,
						type : getJewel(x, y)
					});
					jewels[x][y + gaps[x]] = getJewel(x, y);
				}
			}
			
			// fill board from top as necessary
			for (y = 0; y < gaps[x]; y++) {
				jewels[x][y] = randomJewel();
				moved.push({
					toX : x,
					toY : y,
					fromX : x,
					fromY : y - gaps[x],
					type: jewels[x][y]
				});
			}
		}
		
	    events = events || [];
		
		if (hadChains) {
			events.push({
				type : 'remove',
				data : removed
			}, {
				type : 'score',
				data : score
			}, {
				type : 'move',
				data : moved
			});
			
			if (!hasMoves()) {
				fillBoard();
				events.push({
					type : 'refill',
					data : getBoard()
				});
			}
			
			return check(events);
		} else {
			return events;
		}
	}
	
	function canJewelMove(x, y) {
		// returns true if x, y valid positions and jewel at x, y can swap with neighbour
		return (
				(x > 0 && canSwap(x, y, x-1, y))      ||
				(x < cols-1 && canSwap(x, y, x+1, y)) ||
				(y > 0 && canSwap(x, y, x, y-1))      ||
				(y < rows-1 && canSwap(x, y, x, y+1))
		       );
	}
	
	function swap (x1, y1, x2, y2, callback) {
		var tmp,
		    swap1, 
		    swap2,
		    events = [];
		
		swap1 = {
			type : 'move',
			data : [{
				type : getJewel(x1, y1),
			    fromX : x1, 
			    fromY : y1,
			    toX : x2,
			    toY : y2
			},{
				type : getJewel(x2, y2),
			    fromX : x2, 
			    fromY : y2,
			    toX : x1,
			    toY : y1
			}]
		};
		
		swap2 = {
			type : 'move',
			data : [{
				type : getJewel(x2, y2),
			    fromX : x1, 
			    fromY : y1,
			    toX : x2,
			    toY : y2
			},{
				type : getJewel(x1, y1),
			    fromX : x2, 
			    fromY : y2,
			    toX : x1,
			    toY : y1
			}]
		};		
	
		if (isAdjacent(x1, y1, x2, y2)) {
			events.push(swap1);
			if (canSwap(x1, y1, x2, y2)) {
				tmp = getJewel(x1, y1);
				jewels[x1][y1] = getJewel(x2, y2);
				jewels[x2][y2] = tmp;
				events = events.concat(check());
			} else {
				events.push(swap2, {type : 'badswap'});
			}
			callback(events);
		}
	}	
	
	function initialize(callback) {
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
		swap :       swap,
		canSwap :    canSwap,
		print :      print,
		getBoard:    getBoard
	};
	
})();
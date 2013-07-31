/**
 * Displays game board using canvas element
 */

jewel.display = (function() {
	var animations = [],
	    previousCycle,
	    cursor,
	    jewels,
	    dom = jewel.dom,
	    $ = dom.$,
	    canvas,
	    ctx,
	    cols,
	    rows,
	    jewelSize,
	    firstRun = true;
	
	function createBackground() {
        console.log('Display.canvas.js createBackground();');
		var background = document.createElement('canvas'),
		    bgctx = background.getContext('2d');
		
		dom.addClass(background, 'background');
		background.width = cols * jewelSize;
		background.height = rows * jewelSize;
		
		bgctx.fillStyle = 'rgba(225,235,255,0.15)';
		for (var x = 0; x < cols; x++) {
			for (var y = 0; y < cols; y++) {
				if( (x + y) % 2 ) {
					bgctx.fillRect(
						x * jewelSize, y* jewelSize,
						jewelSize, jewelSize
					);
				}
			}
		}
		return background;
	}
	
	function setup() {
		console.log('Display.canvas.js setup();');
		
		var boardElement = $('#game-screen .game-board')[0];
		
		cols = jewel.settings.cols;
		rows = jewel.settings.rows;
		jewelSize = jewel.settings.jewelSize;
	
		canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d');
		dom.addClass(canvas, 'board');
		canvas.width = cols * jewelSize;
		canvas.height = rows * jewelSize;
		
		ctx.scale(jewelSize, jewelSize);
		boardElement.appendChild(createBackground());
		boardElement.appendChild(canvas);
		
		previousCycle = Date.now();
		requestAnimationFrame(cycle);
	}
	
	function addAnimation(runTime, fncs) {
		var anim = {
			runTime : runTime,
			startTime : Date.now(),
			pos : 0,
		    fncs : fncs
		};
		
		animations.push(anim);
	}
	
	function renderAnimations(time, lastTime) {
		var anims = animations.slice(0),
		    n = anims.length,
		    animTime,
		    anim,
		    i;
		
		// call before function
		for (i = 0; i < n; i++) {
			anim = anims[i];
			if (anim.fncs.before) {
				anim.fncs.before(anim.pos);
			}
			anim.lastPos = anim.pos;
			animTime = (lastTime - anim.startTime);
			anim.pos = animTime / anim.runTime;
			anim.pos = Math.max(0, Math.min(1, anim.pos));
		}
		
		animations = []; // reset animations list
		
		for (i = 0; i < n; i++) {
			anim = anims[i];
			anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
			if (anim.pos ==1) {
				if (anim.fncs.done) {
					anim.fncs.done();
				}
			} else {
				animations.push(anim);
			}
		}
	}	
	
	function cycle(time) {
		renderCursor(time);
		renderAnimations(time, previousCycle);
		previousCycle = time;
		requestAnimationFrame(cycle);
	}
	
	function initialize(callback) {
		console.log('Display.canvas.js initialize();');
		if (firstRun) {
			setup();
			firstRun = false;
		}
		callback();
	}
	
	function drawJewel(type, x, y, scale, rot) {
		var image = jewel.images['images/jewels' + jewelSize + '.png'];
		ctx.save();
		if (typeof scale !== 'undefined' && scale > 0) {
			ctx.beginPath();
			ctx.rect(x, y, 1, 1);
			ctx.clip();
			ctx.translate(x + 0.5, y + 0.5);
			ctx.scale(scale, scale);
			if (rot) {
				ctx.rotate(rot);
			}
			ctx.translate(-x - 0.5, -y - 0.5);
		}
			
		ctx.drawImage(image, type * jewelSize, 0, jewelSize, jewelSize,
			x, y, 1, 1
		);
		ctx.restore();
	}

	function redraw(newJewels, callback) {
		var x, y;
		jewels = newJewels;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (x = 0; x < cols; x++) {
			for (y = 0; y < rows; y++) {
				drawJewel(jewels[x][y], x, y);
			}
		}
		callback();
		renderCursor();
	}
	
	function renderCursor(time) {
		if (!cursor) {
			return;
		}
		var x = cursor.x,
		    y = cursor.y,
		    t1 = (Math.sin(time / 200) + 1) / 2,
		    t2 = (Math.sin(time / 400) + 1) / 2;
		
		clearCursor();
		
		if (cursor.selected) {
			ctx.save();
			ctx.globalCompositeOperation = 'lighter';
			ctx.globalAlpha = 0.8 * t1;
			drawJewel(jewels[x][y], x, y);
			ctx.restore();
		}
		ctx.save();
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = 'rgba(250, 250, 150, ' + (0.5 + 0.5 * t2) + ')';
		ctx.strokeRect( x + 0.05, y + 0.05, 0.9, 0.9 );
		ctx.restore();
	}
	
	function clearJewel(x, y) {
		ctx.clearRect(x, y, 1, 1);
	}
	
	function clearCursor () {
		if (cursor) {
			var x = cursor.x,
			    y = cursor.y;
			clearJewel(x, y);
			drawJewel(jewels[x][y], x, y);
		}
	}
	
	function setCursor(x, y, selected) {
		clearCursor();
		if (arguments.length > 0) {
			cursor = {
			    x : x,
			    y : y,
			    selected : selected
			};
		} else {
			cursor = null;
		}
		renderCursor();
	}	
	
	function moveJewels(movedJewels, callback) {
		var n = movedJewels.length,
		    oldCursor = cursor;
            
		cursor = null;
		movedJewels.forEach(function(e) {
			var x = e.fromX,
			    y = e.fromY,
			    dx = e.toX - e.fromX,
			    dy = e.toY - e.fromY,
			    dist = Math.abs(dx) + Math.abs(dy);
			addAnimation(200 * dist, {
				before : function(pos) {
					pos = Math.sin(pos * Math.PI / 2);
					clearJewel(x + dx * pos, y + dy * pos);
				},
				render : function(pos) {
					pos = Math.sin(pos * Math.PI / 2);
					drawJewel(e.type, x + dx * pos, y + dy * pos);
				},
				done : function() {
					if (--n == 0) {
						cursor = oldCursor;
						callback();
					}
				}
			});
		});
	}
	
	function removeJewels(removedJewels, callback) {
		var n = removedJewels.length;
		removedJewels.forEach(function(e) {
		    addAnimation(400, {
		    	before : function() {
		    		clearJewel(e.x, e.y);
		    	}, 
		    	render : function(pos) {
		    		ctx.save();
		    		ctx.globalAlpha = 1 - pos;
		    		drawJewel(e.type, e.x, e.y, 1 - pos, pos * Math.PI *2);
		    		ctx.restore();
		    	},
		    	done : function() {
		    		if (--n == 0) {
		    			callback();
		    		}
		    	}
		    });	
		});
	}
	
	function refill(newJewels, callback) {
		var lastJewel = 0;
		addAnimation(1000, {
			render : function(pos) {
				var thisJewel = Math.floor(pos * cols * rows),
				    i,
				    x,
				    y;
				for (i = lastJewel; i < thisJewel; i++) {
					x = i % cols;
					y = Math.floor(i / cols);
					clearJewel(x, y);
					drawJewel(newJewels[x][y], x, y);
				}
				lastJewel = thisJewel;
				canvas.style.webkitTransform = 'rotateX(' + (360 * pos) + 'deg)';
			},
			done : function() {
				canvas.style.webkitTransform = '';
				callback();
			}
		});
	}
	
	function levelUp(callback) {
		addAnimation(1000, {
			before : function(pos) {
				var j = Math.floor(pos * rows * 2),
				    x, 
				    y;
				for (y = 0, x = j; y < rows; y++, x--) {
					if (x >= 0 && x < cols) {
						clearJewel(x, y);
						drawJewel(jewels[x][y], x, y);
					}
				}
			},
			render : function(pos) {
				var j = Math.floor(pos * rows * 2),
				    x,
				    y;
				for (y = 0, x = j; y < rows; y++, x--) {
					if (x >= 0 && x < cols) {
						drawJewel(jewels[x][y], x, y, 1.1);
					}
				}
				ctx.restore();
			},
			done : callback
		});
	}
	
	function gameOver(callback) {
		addAnimation(1000, {
			render : function(pos) {
				canvas.style.left = 0.2 * pos * (Math.random() - 0.5) + 'em';
				canvas.style.top = 0.2 * pos * (Math.random() - 0.5) + 'em';
			},
			done : function() {
				canvas.style.left = '0';
				canvas.style.top = '0';
				explode(callback);
			}
		});
	}
	
	return {
		initialize : initialize,
		redraw : redraw,
		setCursor : setCursor,
		moveJewels : moveJewels,
		removeJewels : removeJewels,
		refill : refill,
		levelUp : levelUp,
		gameOver: gameOver
	}
	
})();
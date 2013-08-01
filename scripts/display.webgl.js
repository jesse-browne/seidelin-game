/**
 * WebGL display module 
 */

jewel.display = (function() {
	var program,
	    geometry,
	    aVertex,
	    aNormal,
	    uScale,
	    uColor,
	    dom = jewel.dom,
	    webgl = jewel.web.gl,
	    $ = dom.$,
	    canvas,
	    gl,
	    cursor,
	    cols,
	    rows,
	    animations = [],
	    previousCycle,
	    firstRun = true,
	    jewels;

    var colors = [
        [0.1, 0.8, 0.1],
        [0.9, 0.1, 0.1],
        [0.9, 0.3, 0.8],
        [0.8, 1.0, 1.0],
        [0.2, 0.4, 1.0],
        [1.0, 0.4, 0.1],
        [1.0, 0.9, 0.1]
    ];
	
	function initialize(callback) {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		requestAnimationFrame(cycle);
		callback();
	}

	function setupShaders() {
		var vsource = 
		'attribute vec3 aVertex;\r\n' +
		'attribute vec3 aNormal;\r\n' +

		'uniform mat4 uModelView;\r\n' +
		'uniform mat4 uProjection;\r\n' +
		'uniform mat3 uNormalMatrix;\r\n" +
		'uniform vec3 uLightPosition;\r\n" +
		
		'uniform float uScale;\r\n' +
		
		'varying float vDiffuse;\r\n' +
		'varying float vSpecular;\r\n' +
		'varying vec4 vPosition;\r\n' +
		'varying vec3 vNormal;\r\n' +
		
		'void main(void) {\r\n' +
		'	vPosition = uModelView * vec4(aVertex * uScale, 1.0);\r\n' +
		'	vNormal = normalize(aVertex);\r\n' +
		
		'	vec3 normal = normalize(uNormalMatrix * aNormal);\r\n' +
		'	vec3 lightDir = uLightPosition - vPosition.xyz;\r\n' +
		'	lightDir = normalize(lightDir);\r\n' +

		'	vDiffuse = max(dot(normal, lightDir), 0.0);\r\n' +
		
		'	vec3 viewDir = normalize(vPosition.xyz);\r\n' +
		'	vec3 reflectDir = reflect(lightDir, normal);\r\n' +
		'	float specular = dot(reflectDir, viewDir);\r\n' +
		'	vSpecular = pow(specular, 16.0);\r\n' +
		
		'	gl_Position = uProjection * vPosition;\r\n' +
		'}'
		;

		var fsource = 
		'#ifdef GL_ES\r\n' +
		'precision mediump float;\r\n' + 
		'#endif\r\n' +
		
		'uniform sampler2D uTexture;\r\n' +
		'uniform float uAmbient;\r\n' +
		'uniform vec3 uColor;\r\n' +

		'varying float vDiffuse;\r\n' +
		'varying float vSpecular;\r\n' +
		'varying vec3 vNormal;\r\n' +
		
		'void main(void) {\r\n' +
		'	float theta = acos(vNormal.y) / 3.14159;' +
		'	float phi = atan(vNormal.z, vNormal.x) / (2.0 * 3.14159);' +
		'	vec2 texCoord = vec2(-phi, theta);' +
		
		'	float texColor = texture2D(uTexture, texCoord).r;\r\n' +
	
		'	float light = uAmbient + vDiffuse + vSpecular + texColor;\r\n' +
			
		'	gl_FragColor = vec4(uColor * light, 0.7);\r\n' +
		'}\r\n'
		;
		
		var vshader = webgl.createShaderObject(gl, gl.VERTEX_SHADER, vsource),
			fshader = webgl.createShaderObject(gl, gl.FRAGMENT_SHADER, fsource);
			
		return webgl.createProgramObject(gl, vshader, fshader);
	}
    
    function setupTexture() {
        var image = new Image();
        image.addEventListener('load', function() {
            var texture = webgl.createTextureObject(gl, image);
            gl.uniform1i(
                gl.getUniformLocation(program, 'uTexture'), 
                'uTexture', 0
            );
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
        }, false);
        image.src = 'images/jewelpattern.jpg';
    }

	function setupGL() {
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		
		program = setupShaders();
		setupTexture();
		gl.useProgram(program);
		aVertex = gl.getAttribLocation(program, 'aVertex');
		aNormal = gl.getAttribLocation(program, 'aNormal');
		uScale = gl.getAttribLocation(program, 'uScale');
		uColor = = gl.getAttribLocation(program, 'uColor');
		
		gl.enableVertexAttribArray(aVertex);
		gl.enableVertexAttribArray(aNormal);
		
		gl.uniform1f(gl.getUniformLocation(program, 'uAmbient'), 0.12);
		gl.uniform3f(gl.getUniformLocation(program, 'uLightPosition'), 20, 15, -10);
		
		webgl.loadModel(gl, 'models/jewel.dae', function(geom) {
			geometry = geom;
		});
		webgl.setProjection(gl, program, 60, cols/rows, 0.1, 100);
	}    
    
	function setup() {
		var boardElement = $('#game-screen .game-board')[0];
		
		cols = jewel.settings.cols;
		rows = jewel.settings.rows;
		jewels = [];
		
		canvas = document.createElement('canvas');
		gl = canvas.getContext('experimental-webgl');
		dom.addClass(canvas, 'board');
		canvas.width = cols * jewel.settings.jewelSize;
		canvas.height = rows * jewel.settings.jewelSize;
		
		boardElement.appendChild(canvas);
		setupGL();
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
        var anims = animations.slice(0), // copy list
            n = anims.length,
            animTime,
            anim,
            i;

        // call before() function
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

        animations = []; // reset animation list

        for (i = 0; i < n; i++) {
            anim = anims[i];
            anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
            if (anim.pos == 1) {
                if (anim.fncs.done) {
                    anim.fncs.done();
                }
            } else {
                animations.push(anim);
            }
        }
    }

    function levelUp(callback) {
        addAnimation(500, {
            render : function(pos) {
                gl.uniform1f(
                    gl.getUniformLocation(program, 'uAmbient'),
                    0.12 + Math.sin(pos * Math.PI) * 0.5
                );
            },
            done : callback
        });
    }

    function gameOver(callback) {
        removeJewels(jewels, callback);
    }
	
	function setCursor(x, y, selected) {
		cursor = null;
		if (arguments.length > 0) {
			cursor = {
					x : x,
					y : y,
					selected : selected
			};
		}
	}

	function createJewel(x, y, type) {
		var jewel = {
			x : x,
			y : y,
			type : type,
			rnd : Math.random() * 2 -1,
			scale : 1
		};
		jewels.push(jewel);
		return jewel;
	}
	
	function getJewel(x, y) {
		return jewels.filter(function(j){
			return j.x == x && j.y == y
		})[0];
	}

	function redraw(newJewels, callback) {
		var x, 
		    y,
		    jewel,
		    type;
		for (x = 0; x < cols; x++) {
			for (y = 0; y < rows; y++) {
				type = newJewels[x][y];
				jewel = getJewel(x, y);
				if (jewel) {
					jewel.type = type;
				} else {
					createJewel(x, y, type);
				}
			}
		}
		callback();
	}
	
    function drawJewel(jewel) {
        var x = jewel.x - cols / 2 + 0.5,  
            y = -jewel.y + rows / 2 - 0.5, 
            scale = jewel.scale,
            n = geometry.num;

        var mv = webgl.setModelView(gl, program,
            [x * 4.4, y * 4.4, -32], 
            Date.now() / 1500 + jewel.rnd * 100, 
            [0, 1, 0.1] 
        );
        webgl.setNormalMatrix(gl, program, mv);

        // add effect for selected jewel
        if (cursor && jewel.x == cursor.x && jewel.y == cursor.y) {
            scale *= 1.0 + Math.sin(Date.now() / 100) * 0.1
        }

        gl.uniform1f(uScale, scale);
        gl.uniform3fv(uColor, colors[jewel.type]);

        gl.cullFace(gl.FRONT);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

        gl.cullFace(gl.BACK);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
    }	
	
	function draw() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, canvas.width, canvas.height);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vbo);
		gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, geometry.nbo);
		gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.ibo);
		
		jewels.forEach(drawJewel);
	}
	
	function cycle(time) {
		renderAnimations(time, previousCycle);
		if (geometry) {
			draw();
		}
		previousCycle = time;
		requestAnimationFrame(cycle);
	}
	
    function moveJewels(movedJewels, callback) {
        var n = movedJewels.length;
        movedJewels.forEach(function(mover) {
            var jewel = getJewel(mover.fromX, mover.fromY),
                dx = mover.toX - mover.fromX,
                dy = mover.toY - mover.fromY,
                dist = Math.abs(dx) + Math.abs(dy);

            if (!jewel) {
                jewel = createJewel(mover.fromX, mover.fromY,
                            mover.type);
            }
            addAnimation(200 * dist, {
                render : function(pos) {
                    pos = Math.sin(pos * Math.PI / 2);
                    jewel.x = mover.fromX + dx * pos;
                    jewel.y = mover.fromY + dy * pos;
                },
                done : function() {
                    jewel.x = mover.toX;
                    jewel.y = mover.toY;
                    if (--n === 0) { 
                        callback();
                    }
                }
            });
        });
    }

    function removeJewels(removedJewels, callback) {
        var n = removedJewels.length;
        removedJewels.forEach(function(removed) {
            var jewel = getJewel(removed.x, removed.y),
                y = jewel.y, 
                x = jewel.x;
            addAnimation(400, {
                render : function(pos) {
                    jewel.x = x + jewel.rnd * pos * 2;
                    jewel.y = y + pos * pos * 2;
                    jewel.scale = 1 - pos;
                },
                done : function() {
                    jewels.splice(jewels.indexOf(jewel), 1);
                    if (--n == 0) { 
                        callback();
                    }
                }
            });
        });
    }
	
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
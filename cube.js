let cubes = angular.module('cubes', []);
cubes.controller('cubes_controller', function($scope, $http){

$scope.iterate = ["glcanvas"];
cubeRotation = 0.0;
rate = 0.001;
faceColors = [
  [0.0,  0.0,  0.0,  1.0],    // Front face: white
  [0.0,  0.0,  0.0,  1.0],    // Back face: red
  [0.0,  0.0,  0.0,  1.0],    // Top face: green
  [0.0,  0.0,  0.0,  1.0],    // Bottom face: blue
  [0.0,  0.0,  0.0,  1.0],    // Right face: yellow
  [0.0,  0.0,  0.0,  1.0],    // Left face: purple
];
positions = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];
triangle_locations = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];
to_cover = [1.0, 1.0, 1.0];
rotation_quantity = [1, 1, 1];

window.onload = start;

//init
function start(){
$scope.iterate.forEach(canvas_name => {
  let canvas = document.querySelector("#"+canvas_name);
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  i = 0;
  for (i = 0; i <= 5; i++)
  {
    faceColors[i][0] = getRandomArbitrary(0.4, 0.8);
    faceColors[i][1] = getRandomArbitrary(0.0, 0.5);
    faceColors[i][2] = getRandomArbitrary(0.4, 0.8);
    faceColors[i][3] = getRandomArbitrary(0.7, 0.8);
  }
  to_cover[0] = getRandomArbitrary(0.0, 1.0);
  to_cover[1] = getRandomArbitrary(0.0, 1.0);
  to_cover[2] = getRandomArbitrary(0.0, 1.0);
  main(rate, faceColors, positions, canvas_name, triangle_locations, to_cover, rotation_quantity, gl);
});
}

//main
function main(rate, faceColors, positions, canvas_name, triangle_locations, to_cover, rotation_quantity, gl)
{
  let X = to_cover[0];
  let Y = to_cover[1];
  let Z = to_cover[2];

  let vsSource = `attribute vec4 aVertexPosition; attribute vec4 aVertexColor; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor; void main(void) { gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition; vColor = aVertexColor; } `;

  let fsSource = `varying lowp vec4 vColor; void main(void) { gl_FragColor = vColor; } `;

  let shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  let programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    }
  };

  let buffers = initBuffers(gl);
  let then = 0;

  // Draw the scene repeatedly
  function render(now)
  {
    now *= rate;  // convert to seconds
    let deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, buffers, deltaTime, X, Y, Z, rotation_quantity[0], rotation_quantity[1], rotation_quantity[2]);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

});

//random number generation
function getRandomArbitrary(min, max)
{
  return parseFloat(Math.random() * (max - min) + min).toFixed(2);
}

// initBuffers Initialize the buffers we'll need. For this demo, we just have one object -- a simple three-dimensional cube.
function initBuffers(gl)
{
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  // Convert the array of colors into a table for all the vertices.
  let colors = [];

  for (let j = 0; j < faceColors.length; ++j)
  {
    let c = faceColors[j];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.
  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangle_locations), gl.STATIC_DRAW);

  return {position: positionBuffer, color: colorBuffer, triangle_locations: indexBuffer};
}

function number(x)
{
  return parseFloat(x);
}

translate_range_h = [-11.0, 11.0];
translate_range_v = [-6.0, 6.0];
translate = [[number(getRandomArbitrary(translate_range_h[0], translate_range_h[1])), number(getRandomArbitrary(translate_range_h[0], translate_range_h[1]))],
             [number(getRandomArbitrary(translate_range_v[0], translate_range_v[1])), number(getRandomArbitrary(translate_range_v[0], translate_range_v[1]))]];

function drawScene(gl, programInfo, buffers, deltaTime, X, Y, Z, Xt, Yt, Zt)
{
  diff1 = translate[0][1] - translate[0][0];
  diff2 = translate[1][1] - translate[1][0];
  if ( Math.abs(diff1) < 0.1 )
  {
    translate[0][1] = getRandomArbitrary(translate_range_h[0], translate_range_h[1]);
    diff1 = translate[0][1] - translate[0][0];
  }
  translate[0][0] = translate[0][0] + number( 0.1 * Math.sign(diff1) );

  if ( Math.abs(diff2) < 0.1 )
  {
    translate[1][1] = getRandomArbitrary(translate_range_v[0], translate_range_v[1]);
    diff2 = translate[1][1] - translate[1][0];
  }
  translate[1][0] = translate[1][0] + number( 0.1 * Math.sign(diff2) );

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.enable(gl.CULL_FACE);
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  let fieldOfView = 45 * Math.PI / 180;   // in radians
  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  let zNear = 0.1;
  let zFar = 100.0;
  let projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  let modelViewMatrix = mat4.create();
  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  modelViewMatrix = mat4.translate(modelViewMatrix, modelViewMatrix, [translate[0][0], translate[1][0], -15.0]);  // amount to translate

  modelViewMatrix = mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * Zt, [0, 0, Z]);       // axis to rotate around (Z)

  modelViewMatrix = mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * Yt, [0, Y, 0]);       // axis to rotate around (X)

  modelViewMatrix = mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * Xt, [X, 0, 0]);     //rotate Y

  //modelViewMatrix = mat4.scale(modelViewMatrix, 1.0, 1.0, 1.0);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    let numComponents = 3;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer( programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    let numComponents = 4;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer( programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.triangle_locations);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

  {
    let vertexCount = 36;
    let type = gl.UNSIGNED_SHORT;
    let offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw
  cubeRotation += deltaTime;
}

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource)
{
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
  {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

// creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {

  let shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
  {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

var test = require("tape");
var KenBurnsWebGL = require(".");
var createTexture = require("gl-texture2d");
var baboon = require("baboon-image");

var baboonWidth = baboon.shape[0];
var baboonHeight = baboon.shape[1];

var THRESHOLD = 16;

function Canvas (width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function Context (canvas) {
  return canvas.getContext("webgl");
}

function colorDiff (a, b) {
  var diff = 0;
  for (var i=0; i<4; ++i) {
    diff += Math.pow(a[i]-b[i], 2);
  }
  return Math.sqrt(diff);
}

test("KenBurnsWebGL + KenBurnsWebGL#dispose", function (t) {
  var canvas = Canvas(400, 100);
  var gl = Context(canvas);
  var kenburns = KenBurnsWebGL(gl);
  t.ok(kenburns instanceof KenBurnsWebGL, "KenBurnsWebGL is a class");
  kenburns.dispose();
  t.end();
});

test("KenBurnsWebGL#render", function (t) {
  var canvas = Canvas(400, 100);
  var gl = Context(canvas);
  var texture = createTexture(gl, baboon.transpose(1, 0));
  var kenburns = KenBurnsWebGL(gl);
  kenburns.rgb = [ 1, 0.5, 0.2 ];
  var rgba = kenburns.rgb.map(function (v) { return Math.round(v * 255); }).concat([ 255 ]);

  kenburns.render(texture, [ 0, 0, baboonWidth, baboonHeight ]);
  var pixels1 = new Uint8Array(4);
  gl.readPixels(200, 50, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels1);

  kenburns.render(texture, [ baboonWidth/8, baboonHeight/8, baboonWidth/4, baboonHeight/4 ]);
  var pixels2 = new Uint8Array(4);
  gl.readPixels(200, 50, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels2);

  kenburns.render(texture, [ baboonWidth/4, baboonHeight/4, baboonWidth/2, baboonHeight/2 ]);
  var pixels3 = new Uint8Array(4);
  gl.readPixels(200, 50, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels3);

  kenburns.render(texture, [ 0.1 * baboonWidth, 0.1 * baboonHeight, 0.3 * baboonWidth, 0.1 * baboonHeight ]);
  var pixels4 = new Uint8Array(4);
  gl.readPixels(200, 50, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels4);

  kenburns.render(texture, [ -baboonWidth*0.6, -baboonHeight*0.6, baboonWidth, baboonHeight ]);
  var pixels5 = new Uint8Array(4);
  gl.readPixels(200, 50, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels5);

  t.ok(colorDiff(pixels1, [ 196, 177, 193, 255 ]) < THRESHOLD, "pixels1 matches expected");
  t.ok(colorDiff(pixels2, [ 134, 110, 85, 255 ]) < THRESHOLD, "pixels2 matches expected");
  t.ok(colorDiff(pixels3, [ 202, 159, 185, 255 ]) < THRESHOLD, "pixels3 matches expected");
  t.ok(colorDiff(pixels4, [ 82, 104, 120, 255 ]) < THRESHOLD, "pixels4 matches expected");
  t.ok(colorDiff(pixels5, rgba) < THRESHOLD, "pixels5 matches expected");

  texture.dispose();
  kenburns.dispose();
  t.end();
});

test("KenBurnsWebGL#getViewport + check resize support", function (t) {
  var canvas = Canvas(400, 100);
  var gl = Context(canvas);
  var texture = createTexture(gl, baboon.transpose(1, 0));
  var kenburns = KenBurnsWebGL(gl);
  var pixels = new Uint8Array(4);

  t.deepEqual(kenburns.getViewport(), { width: 400, height: 100}, "initial size");

  kenburns.render(texture, [ 0, 0, baboonWidth, baboonHeight ]);
  gl.readPixels(200, 50, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  t.ok(colorDiff(pixels, [ 196, 177, 193, 255 ]) < THRESHOLD, "pixels initially matches expected");

  gl.viewport(0, 0, canvas.width = 256, canvas.height = 256);

  t.deepEqual(kenburns.getViewport(), { width: 256, height: 256 }, "resized size");

  kenburns.render(texture, [ 0, 0, baboonWidth, baboonHeight ]);
  gl.readPixels(128, 128, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  t.ok(colorDiff(pixels, [ 197, 173, 188, 255 ]) < THRESHOLD, "pixels matches expected after resize");

  t.deepEqual(kenburns.getViewport(), { width: 256, height: 256 }, "resized size");

  texture.dispose();
  kenburns.dispose();
  t.end();
});


test("intensive create and destroy", function (t) {
  function loop (i) {
    if (i === 0) return;
    setTimeout(function () {
      loop(i-1);
    }, 0);
    t.doesNotThrow(function () {
      var canvas = Canvas(64, 64);
      var gl = Context(canvas);
      var texture = createTexture(gl, baboon.transpose(1, 0));
      var kenburns = KenBurnsWebGL(gl);
      kenburns.render(texture, [0, 0, 64, 64]);
      texture.dispose();
      kenburns.dispose();
    }, "loop "+i);
  }

  var n = 128;
  t.plan(n);
  loop(n);
});

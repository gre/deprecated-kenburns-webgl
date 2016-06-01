var createShader = require("gl-shader");

var vert = require("./main.vert");
var frag = require("./main.frag");

function KenBurnsWebGLTrait (gl) {
  if (!(this instanceof KenBurnsWebGLTrait)) return new KenBurnsWebGLTrait(gl);
  this.gl = gl;

  this.shader = createShader(gl, vert, frag);
  this.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
      1.0, -1.0,
      1.0,  1.0]),
    gl.STATIC_DRAW);
}
KenBurnsWebGLTrait.prototype = {

  clamped: true,

  rgb: [0,0,0],

  dispose: function () {
    this.shader.dispose();
    this.gl.deleteBuffer(this.buffer);
    this.gl = null;
    this.shader = null;
    this.buffer = null;
  },

  render: function (texture, bound) {
    var x = bound[0];
    var y = bound[1];
    var w = bound[2];
    var h = bound[3];
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h))
      throw new Error("invalid numbers in bound: "+bound);

    var gl = this.gl;
    var shader = this.shader;
    shader.bind();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    shader.attributes.p.pointer();

    shader.uniforms.imgRes = texture.shape.slice(0, 2);
    shader.uniforms.bg = this.rgb;
    shader.uniforms.img = texture.bind();
    shader.uniforms.pos = [ x, y ];
    shader.uniforms.dim = [ w, h ];

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  },

  getViewport: function () {
    return {
      width: this.gl.drawingBufferWidth,
      height: this.gl.drawingBufferHeight
    };
  }
};

module.exports = KenBurnsWebGLTrait;

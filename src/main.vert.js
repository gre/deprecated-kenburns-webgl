module.exports = "\
varying vec2 uv;\n\
\n\
attribute vec2 p;\n\
\n\
uniform vec2 imgRes; // image size\n\
uniform vec2 pos; // bound position\n\
uniform vec2 dim; // bound size\n\
\n\
void main() {\n\
  uv = pos/imgRes + ((p * vec2(1.,-1.)+1.)/2.) * (dim/imgRes);\n\
  gl_Position = vec4(p,0.,1.);\n\
}\n\
";

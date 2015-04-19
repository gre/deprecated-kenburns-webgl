
varying vec2 uv;

attribute vec2 p;

uniform vec2 imgRes; // image size
uniform vec2 pos; // bound position
uniform vec2 dim; // bound size

void main() {
  uv = pos/imgRes + ((p * vec2(1.,-1.)+1.)/2.) * (dim/imgRes);
  gl_Position = vec4(p,0.,1.);
}

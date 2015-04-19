precision highp float;

varying vec2 uv;

uniform sampler2D img;
uniform vec3 bg;

void main() {
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)
    gl_FragColor = vec4(bg, 1.0);
  else
    gl_FragColor = texture2D(img, uv);
}

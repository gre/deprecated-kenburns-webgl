module.exports = "\
precision highp float;\n\
\n\
varying vec2 uv;\n\
\n\
uniform sampler2D img;\n\
uniform vec3 bg;\n\
\n\
void main() {\n\
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)\n\
    gl_FragColor = vec4(bg, 1.0);\n\
  else\n\
    gl_FragColor = texture2D(img, uv);\n\
}\n\
";

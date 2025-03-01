varying vec4 v_color;  // The color passed from the vertex shader

void main() {
    gl_FragColor = v_color;  // Output the color for the line
}

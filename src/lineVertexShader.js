attribute vec3 a_position;   // Vertex position
attribute vec4 a_color;      // Vertex color (RGBA)

varying vec4 v_color;        // Color to pass to the fragment shader

const float far = 100.0; // Farthest distance visible to camera
const float near = 0.1;  // Closest distance visible to camera

// Field of view and projection matrix calculations
float fov = radians(25.0); // Vertical y-axis field of view of the camera
float f = 1.0 / tan(fov / 2.0);

mat4 projection = mat4(f / u_aspectRatio, 0.0, 0.0, 0.0,
                       0.0, f, 0.0, 0.0,
                       0.0, 0.0, (near + far) / (near - far), 1.0,
                       0.0, 0.0, (near * far * 2.0) / (near - far), 1.0);

mat4 camera = mat4(1.0, 0.0, 0.0, 0.0,
                   0.0, 1.0, 0.0, 0.0,
                   0.0, 0.0, 1.0, 0.0,
                   0.0, 0.0, 1.0, 1.0);

void main() {
    // Calculate the final vertex position in clip space
    gl_Position = projection * camera * vec4(a_position, 1.0);
    
    // Pass the color to the fragment shader
    v_color = a_color;
}

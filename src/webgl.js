async function initWebGL(){

    canvas = document.getElementById('webglCanvas');
    gl = canvas.getContext('webgl');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (!gl) {
        console.error("WebGL not supported");
        throw "No WebGL context";
    }

    let loadedTextures = 0;

    async function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = '*';
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
        });
    }

    // Load all textures and store them in textureImages array in order
    await Promise.all(textureURLs.map(async (url, index) => {
        return new Promise ((resolve, reject) => {
            loadImage(url).then((img)=>{
                textureImages[index] = img; // Ensure image is placed in the correct order
                loadedTextures++;
                resolve(img);
            }).catch(e=>{
                reject(e);
            })
        })
    }));

    await initPrograms();

    async function initPrograms() {

        // Vertex shader program
        const vsfetch = await fetch("src/textureVertexShader");
        const vertexShaderSource = await vsfetch.text();

        // Fragment shader program
        const fsfetch = await fetch("src/textureFragmentShader");
        const fragmentShaderSource = await fsfetch.text();

        // Vertex shader program
        const vsfetch2 = await fetch("src/lineVertexShader");
        const vertexShaderSource2 = await vsfetch2.text();

        // Fragment shader program
        const fsfetch2 = await fetch("src/lineFragmentShader");
        const fragmentShaderSource2 = await fsfetch2.text();

        // Vertex shader program
        const vsfetch3 = await fetch("src/framebufferVertexShader");
        const vertexShaderSource3 = await vsfetch3.text();

        // Fragment shader program
        const fsfetch3 = await fetch("src/framebufferFragmentShader");
        const fragmentShaderSource3 = await fsfetch3.text();

        // Shader compilation and linking utility functions
        function compileShader(source, type) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("ERROR compiling shader: " + gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        function createProgram(vertexShader, fragmentShader) {
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error("ERROR linking program: " + gl.getProgramInfoLog(program));
            }
            return program;
        }

        // Create shaders and programs
        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        program = createProgram(vertexShader, fragmentShader);

        const vertexShader2 = compileShader(vertexShaderSource2, gl.VERTEX_SHADER);
        const fragmentShader2 = compileShader(fragmentShaderSource2, gl.FRAGMENT_SHADER);
        program2 = createProgram(vertexShader2, fragmentShader2);

        const vertexShader3 = compileShader(vertexShaderSource3, gl.VERTEX_SHADER);
        const fragmentShader3 = compileShader(fragmentShaderSource3, gl.FRAGMENT_SHADER);
        program3 = createProgram(vertexShader3, fragmentShader3);

        // Get locations of the attributes and uniforms
        program.positionLocation = gl.getAttribLocation(program, "a_position");
        program.texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
        program.textureOffsetLocation = gl.getUniformLocation(program, "u_textureOffset");
        program.positionOffsetLocation = gl.getUniformLocation(program, "u_positionOffset");
        program.textureLocation = gl.getUniformLocation(program, "u_texture");
        program.aspectRatioLocation = gl.getUniformLocation(program, "u_aspectRatio");
        program.zoomFactorLocation = gl.getUniformLocation(program, "u_zoomFactor");
        program.colorModifierLocation = gl.getUniformLocation(program, "u_colorModifier");

        program2.positionLocation = gl.getAttribLocation(program2, "a_position");
        program2.colorLocation = gl.getAttribLocation(program2, "a_color");
        program2.aspectRatioLocation = gl.getUniformLocation(program2, "u_aspectRatio");
        program2.zoomFactorLocation = gl.getUniformLocation(program2, "u_zoomFactor");

        program3.positionLocation = gl.getAttribLocation(program3, "a_position");
        program3.texCoordLocation = gl.getAttribLocation(program3, "a_texCoord");
        program3.textureLocation = gl.getUniformLocation(program3, "u_texture");
        // Create buffer and load data
        program.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, program.positionBuffer);
        gl.vertexAttribPointer(program.positionLocation, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.enableVertexAttribArray(program.positionLocation);
        gl.vertexAttribPointer(program.texCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
        gl.enableVertexAttribArray(program.texCoordLocation);

        program2.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, program2.positionBuffer);
        gl.vertexAttribPointer(program2.positionLocation, 3, gl.FLOAT, false, 7 * 4, 0);
        gl.enableVertexAttribArray(program2.positionLocation);
        gl.vertexAttribPointer(program2.colorLocation, 4, gl.FLOAT, false, 7 * 4, 3 * 4);
        gl.enableVertexAttribArray(program2.colorLocation);

        program3.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, program3.positionBuffer);
        gl.vertexAttribPointer(program3.positionLocation, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.enableVertexAttribArray(program3.positionLocation);
        gl.vertexAttribPointer(program3.texCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
        gl.enableVertexAttribArray(program3.texCoordLocation);

        // Create the textures
        textures = textureImages.map((img) => {
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            // Set texture wrapping and filtering
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            return texture;
        });



    };






    // WebGL Rendering Settings
//    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.SCISSOR_TEST);
//    gl.depthFunc(gl.GEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
//    gl.clearDepth(0.0);

}

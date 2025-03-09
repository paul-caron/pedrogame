function initEvents(){

    // Event Handlers
    window.addEventListener('keyup', (event) => {
        event.preventDefault();
        keys[event.key] = false;
        if (event.key === " ")
          protagonist.attack();
    });

    window.addEventListener('keydown', (event) => {
        event.preventDefault();
        keys[event.key] = true;
        if (event.key === " "){
          protagonist.isCharging = true;
        }
    });

    window.addEventListener('resize', (event) => {
        event.preventDefault();
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        //RESIZING THE FRAMEBUFFER TEXTURE
        //bind framebuffer texture
        gl.bindTexture(gl.TEXTURE_2D, frameBufferTexture);

        gl.texImage2D(
        // Always gl.TEXTURE_2D for a 2D texture.
        gl.TEXTURE_2D,
        // Mipmap level.  Always 0.
        0,
        // Internal format of each pixel.  Here we want an RGBA texture.
        gl.RGBA,
        // Width of the texture.
        width,
        // Height of the texture.
        height,
        // Width of the border of the texture.  Always 0.
        0,
        // The pixel format of the data that is going to be uploaded to the GPU.
        // We have no data here, so use something that matches the internal format.
        gl.RGBA,
        // The type of each component of the pixel that is going to be uploaded.
        // Here we want a floating point texture.
        gl.UNSIGNED_BYTE,
        // The data that is going to be uploaded.
        // We don't have any data, so we give null.
        // WebGL will just allocate the texture and leave it blank.
        null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    });

    canvas.addEventListener('touchstart', (event) => { event.preventDefault(); document.querySelector("#buttons").style.visibility = "visible"; });
    document.querySelector("#left").addEventListener("touchstart", (e) => { e.preventDefault(); keys["ArrowLeft"] = true; });
    document.querySelector("#left").addEventListener("touchend", (e) => { e.preventDefault(); keys["ArrowLeft"] = false; });
    document.querySelector("#right").addEventListener("touchstart", (e) => { e.preventDefault(); keys["ArrowRight"] = true; });
    document.querySelector("#right").addEventListener("touchend", (e) => { e.preventDefault(); keys["ArrowRight"] = false; });
    document.querySelector("#up").addEventListener("touchstart", (e) => { e.preventDefault(); keys["ArrowUp"] = true; });
    document.querySelector("#up").addEventListener("touchend", (e) => { e.preventDefault(); keys["ArrowUp"] = false; });
    document.querySelector("#down").addEventListener("touchstart", (e) => { e.preventDefault(); keys["ArrowDown"] = true; });
    document.querySelector("#down").addEventListener("touchend", (e) => { e.preventDefault(); keys["ArrowDown"] = false; });
    document.querySelector("#attack").addEventListener("touchstart", (e) => {
        e.preventDefault();
        protagonist.isCharging = true;
    });
    document.querySelector("#attack").addEventListener("touchend", (e) => {
        e.preventDefault();
        protagonist.attack();
    });

}

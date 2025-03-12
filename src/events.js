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
        if (event.key === "m"){ //music toggle
            if(audio.paused){
                audio=document.querySelector(audios[audioIndex++]);
                audio.play();
                audioIndex %= audios.length;
            }else{
                audio.pause();
            };
        }
        if (!isNaN(0.0+Number.parseInt(event.key))){
          console.log(event.key);
          framebuffer.option = Number(event.key);
        }
        if (event.key === '+'  || event.key === '='){
            if(zoomFactor > 0) zoomFactor -= 0.25;
        }
        if (event.key === '-'){
            if(zoomFactor < 2) zoomFactor += 0.25;
        }
    });

    window.addEventListener('resize', (event) => {
        event.preventDefault();
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        framebuffer.resize();
    });

    canvas.addEventListener('touchstart', (event) => { event.preventDefault(); document.querySelector("#buttons").style.visibility = "visible"; });
    document.querySelector("#music").addEventListener("click", (e) => {
        e.preventDefault();
        if(audio.paused){
            audio=document.querySelector(audios[audioIndex++]);
            audio.play();
            audioIndex %= audios.length;
        }else{
            audio.pause();
        };
    });
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

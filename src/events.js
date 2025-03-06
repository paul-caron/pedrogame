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
        if(protagonist.isCharging) return; //dont move when charging
        keys[event.key] = true;
        if (event.key === " "){
          protagonist.isCharging = true;
          keys = {}; //dump all key presses, dont move when charging
        }
    });

    window.addEventListener('resize', (event) => {
        event.preventDefault();
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
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

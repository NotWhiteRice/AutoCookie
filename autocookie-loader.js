if(AutoCookie === undefined) var AutoCookie = {};

var acModules = [
    //"bot-main.js"
]

AutoCookie.loader = setInterval(function () {
    if (Game && Game.ready) {
        clearInterval(AutoCookie.loader)
        AutoCookie.loader = 0
        if(AutoCookie.loadModules()) AutoCookie.registerMod()
    }
}, 1000);

function loadScript(src, callback) {
    const script = document.createElement("script");
    let success = false;
    script.src = src;
    script.onload = function() { 
        callback();
        success = true;
    }
    document.head.appendChild(script);
    return success;
}

AutoCookie.loadModules = function() {
    acModules.forEach(function(module, index) {
        loadScript(module, function() {
            console.log("Successfully loaded '" + module + "'");
        });
    })
}
if(AutoCookie === undefined) var AutoCookie = {};

AutoCookie.repoURL = "https://github.com/NotWhiteRice/AutoCookie"
AutoCookie.modVersion = 1
AutoCookie.gameVersion = 2.052

var acModules = [
    AutoCookie.repoURL + "/autocookie-main.js"
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
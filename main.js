class AutoCookieDependency {
    isLoaded = false
    errorCode = 0
    constructor(name, src, isNeeded) {
        this.name = name
        this.src = src
        this.isNeeded = isNeeded
    }

    failed() { return !this.isLoaded && this.errorCode != 0 }
}

class AutoCookieModule extends AutoCookieDependency {
    constructor(name, isNeeded) {
        super(name, `../mods/${AutoCookie.DEV ? "local" : "workshop"}/AutoCookie/modules/` + name, isNeeded)
    }
}

if(AutoCookie === undefined) var AutoCookie = {};

AutoCookie.DEV = true
AutoCookie.modVersion = 1
AutoCookie.gameVersion = 2.052

AutoCookie.loader = {}
AutoCookie.loader.dependencies = []
AutoCookie.loader.errorCode = 0
AutoCookie.loader.interval = setInterval(function () {
    if (Game && Game.ready) {
        clearInterval(AutoCookie.loader.interval)
        AutoCookie.loader.interval = 0
        AutoCookie.loader.fetchDependencies()
    }
}, 1000);

AutoCookie.loader.fetchDependencies = function() {
    const timeoutDuration = 5000

    let loader = AutoCookie.loader

    const timeout = setTimeout(() => {
        console.log(`[AutoCookie] Unable to load modules within 5 seconds`)
        loader.errorCode = 2
    }, timeoutDuration)

    loader.addModule("autocookie-init.js", true)
    loader.addModule("bot-main.js", true)

    loader.fetchDependency(0)

    clearTimeout(timeout)
}

AutoCookie.loader.fetchDependency = function(index) {
    let loader = AutoCookie.loader
    if(index === loader.dependencies.length) AutoCookie.registerMod()
    else if(loader.errorCode == 2) loader.fetchDependency(index + 1)
    else {
        let dependency = loader.dependencies[index]
        const script = document.createElement("script");
        script.src = dependency.src;

        script.onload = function() {
            console.log("[AutoCookie] Successfully loaded dependency '" + dependency.name + "'")
            dependency.isLoaded = true
            loader.fetchDependency(index + 1)
        }
        script.onerror = function() {
            console.log("[AutoCookie] Failed to load dependency '" + dependency.name + "'")
            dependency.errorCode = 1
            if(dependency.isNeeded) AutoCookie.loader.error = 1
            if(dependency.name != 'autocookie-init.js') loader.fetchDependency(index + 1)
        }

        document.head.appendChild(script)
    }
}

AutoCookie.loader.addModule = function(name, isNeeded) {
    AutoCookie.loader.dependencies.push(new AutoCookieModule(name, isNeeded))
}

AutoCookie.loader.addScript = function(name, src, isNeeded) {
    AutoCookie.loader.dependencies.push(new AutoCookieDependency(name, src, isNeeded))
}
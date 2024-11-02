if(AutoCookie === undefined) var AutoCookie = {};

AutoCookie.DEV = true
AutoCookie.modVersion = 5
AutoCookie.gameVersion = 2.052
if(AutoCookie.errorCode === undefined) AutoCookie.errorCode = 0

AutoCookie.loader = {}
AutoCookie.loader.timeoutDuration = 5000

{
    let interval = 0
    let dependencies = []

    class Script {
        isLoaded = false
        errorCode = 0
        constructor(name, src, isNeeded) {
            this.name = name
            this.src = src
            this.isNeeded = isNeeded
            dependencies.push(this)
        }

        failed() { return !this.isLoaded && this.errorCode != 0 }
        unattempted() { return !this.isLoaded && this.errorCode == 0 }
    }

    class Module extends Script {
        constructor(name, isNeeded) {
            super(name, `../mods/${AutoCookie.DEV ? `local` : `workshop`}/AutoCookie/modules/` + name, isNeeded)
        }
    }

    interval = setInterval(function () {
        if (Game && Game.ready) {
            clearInterval(interval)
            interval = 0
            if(Game.version != AutoCookie.gameVersion) Game.Notify(`ACLoader--version mismatch`, `AutoCookie was created for Cookie Clicker v${AutoCookie.gameVersion}, and may not work as intended.`, [32, 0])
            declareDeps()
            fetchAndLoad()
        }
    }, 1000);

    let declareDeps = function() {
        new Module(`bot-main.js`, true)
        new Module(`autocookie-menuing.js`, false)
        new Module(`autocookie-main.js`, true)
        new Module(`bot-garden.js`, false)
    }

    let fetchAndLoad = function() {
        Game.Notify(`ACLoader--fetching dependencies`, `Fetching ${dependencies.length} dependencies`, [32, 0])

        let promise = new Promise((resolve, reject) => {
            let instance = AutoCookie.loader

            const timeout = setTimeout(() => {
                console.log(`AutoCookie--Unable to fetch dependencies within ${instance.timeoutDuration}ms`)
                AutoCookie.errorCode = 2
            }, instance.timeoutDuration)

            let loadPromises = dependencies.map((dependency) => {
                return new Promise((depResolve, depReject) => {
                    if(AutoCookie.errorCode != 0) depReject(new Error(`Encountered error code ${AutoCookie.errorCode} while fetching dependencies`))
                    
                    const script = document.createElement(`script`)
                    script.src = dependency.src

                    script.onload = function() {
                        console.log(`AutoCookie--Successfully loaded dependency '${dependency.name}'`)
                        dependency.isLoaded = true
                        depResolve()
                    }
                    script.onerror = function() {
                        console.log(`AutoCookie--Failed to load dependency '${dependency.name}'`)
                        dependency.errorCode = 1
                        if(dependency.isNeeded) {
                            AutoCookie.errorCode = 1
                            depReject(new Error(`Encountered error code 1 while fetching dependencies`))
                        }
                        depResolve()
                    }
    
                    document.head.appendChild(script)
                })
            })

            Promise.all(loadPromises)
                .then(() => {
                    clearTimeout(timeout)
                    resolve()
                }).catch((error) => {
                    clearTimeout(timeout)
                    reject(error)
                })
        }).then((result) => {
            let failedModules = dependencies.filter(dep => dep.failed()).map(dep => `'${dep.name}'`).join(", ")

            if(failedModules) Game.Notify('AutoCookie prompt', `Missing non-essential dependencies--${failedModules}. Certain features may be disabled`, [32, 0]);

            try {
                Game.registerMod("autoCookie", {
                    init:function() {
                        interval = setInterval(() => {
                            try {
                                AutoCookie.runScript()
                            } catch(error) {
                                AutoCookie.errorCode = 4
                                throw error
                            }
                        }, 1);
                        AutoCookie.onInit();
                    },
                    save:function() {},
                    load:function() {},
                })
            } catch(error) {
                AutoCookie.errorCode = 3
                throw error
            }
        }).catch((error) => {
            AutoCookie.kill()
            throw error
        })
    }

    AutoCookie.hasDependency = function(name) {
        return dependencies.filter((dep) => {
            return dep.name == name && dep.isLoaded
        }).length != 0
    }

    AutoCookie.isRunning = function() { return interval != 0 }

    AutoCookie.kill = function() {
        let msg = ``
        const errorCode = AutoCookie.errorCode
        const prompt = AutoCookie.DEV ? `check console for more details` : `please report this to the developer on the Steam workshop or GitHub repo`

        if(interval != 0) {
            clearInterval(interval)
            interval = 0
        }

        if(errorCode < 0) msg = `AutoCookie was provided with error code ${errorCode}, which is reserved for mod compatibility purposes--please don't report this to the AutoCookie developer`
        else if(errorCode == 0) msg = `Either something went wrong or AutoCookie ended peacefully`
        else if(errorCode == 1) {
            let dependency = ``
            for(i = 0; i < dependencies.length; i++) {
                let value = dependencies[i]
                if(value.isNeeded && value.failed()) {
                    dependency = value.name
                    break
                }
            }
            msg = `Failed to load a critical dependency '${dependency}'--${prompt}`
        } else if(errorCode == 2) msg = `Unable to fetch dependencies within ${AutoCookie.loader.timeoutDuration}ms--${prompt}`
        else if(errorCode == 3) msg = `Encountered a runtime error on startup--${prompt}`
        else if(errorCode == 4) msg = `Encountered a runtime error during execution--${prompt}`
        else msg = `Encountered unknown error code: ${errorCode}--${prompt}`

        Game.Notify(`AutoCookie error code: ${AutoCookie.errorCode}`, msg, [32, 20])
    }
}
if(AutoCookie === undefined) var AutoCookie = {};

AutoCookie.DEV = true
AutoCookie.modVersion = 5
AutoCookie.gameVersion = 2.052
AutoCookie.dependencies = []

AutoCookie.loader = {}
AutoCookie.loader.errorCode = 0
AutoCookie.loader.timeoutDuration = 5000

{
    class Script {
        isLoaded = false
        errorCode = 0
        constructor(name, src, isNeeded) {
            this.name = name
            this.src = src
            this.isNeeded = isNeeded
            AutoCookie.dependencies.push(this)
        }

        failed() { return !this.isLoaded && this.errorCode != 0 }
        unattempted() { return !this.isLoaded && this.errorCode == 0 }
    }

    class Module extends Script {
        constructor(name, isNeeded) {
            super(name, `../mods/${AutoCookie.DEV ? `local` : `workshop`}/AutoCookie/modules/` + name, isNeeded)
        }
    }

    let interval = setInterval(function () {
        if (Game && Game.ready) {
            clearInterval(interval)
            interval = 0
            declareDeps()
            fetchAndLoad()
        }
    }, 1000);

    let declareDeps = function() {
        new Module(`bot-main.js`, true)
        new Module(`bot-garden.js`, false)
    }

    let fetchAndLoad = function() {
        Game.Notify(`ACLoader--fetching dependencies`, `Fetching ${AutoCookie.dependencies.length} dependencies`, [32, 0])

        let promise = new Promise((resolve, reject) => {
            let instance = AutoCookie.loader
            let dependencies = AutoCookie.dependencies

            const timeout = setTimeout(() => {
                console.log(`AutoCookie--Unable to fetch dependencies within ${instance.timeoutDuration}ms`)
                instance.errorCode = 2
            }, instance.timeoutDuration)

            let loadPromises = dependencies.map((dependency) => {
                return new Promise((depResolve, depReject) => {
                    if(instance.errorCode != 0) reject(new Error(`Encountered error code ${instance.errorCode} while fetching dependencies`))
                    
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
                            instance.errorCode = 1
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
            let failedModules = AutoCookie.dependencies.filter(dep => dep.failed()).map(dep => `'${dep.name}'`).join(", ")

            if(failedModules) Game.Notify('AutoCookie prompt', `Missing non-essential dependencies--${failedModules}. Certain features may be disabled`, [32, 0]);

            Game.registerMod("autoCookie", {
                init:function() { AutoCookie.onInit(); },
                save:function() {},
                load:function() {},
            })
        }).catch((error) => {
            let msg = ``
            const errorCode = AutoCookie.loader.errorCode

            if(errorCode == 1) {
                let dependency = ``
                for(i = 0; i < AutoCookie.dependencies.length; i++) {
                    let value = AutoCookie.dependencies[i]
                    if(value.isNeeded && value.failed()) {
                        dependency = value.name
                        break
                    }
                }
                msg = `Failed to load a critical dependency--${dependency}`
            } else if(errorCode == 2) msg = `Unable to fetch dependencies within ${AutoCookie.loader.timeoutDuration}ms`
            //else if(errorCode == 3) msg = `Encountered a runtime error when executing a dependency--check console for further details`
            else msg = `Encountered unknown error code: ${errorCode} while fetching dependencies--check console for further details`

            Game.Notify(`ACLoader error code: ${AutoCookie.loader.errorCode}`, msg, [32, 20])
                
            throw error
        })
    }
}
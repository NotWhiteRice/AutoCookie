AutoCookie.registerMod = function() {
    if(AutoCookie.loader.errorCode == 2) {
        Game.Notify('AutoCookie timed out', 'Took longer too long to fetch dependencies', [32, 0])
        return
    }

    let failedModules = ""
    let missingNeeded = false
    AutoCookie.loader.dependencies.forEach((module) => {
        if(module.failed())  {
            failedModules = `${failedModules == "" ? "" : failedModules + ", "}'${module.name}'`
            if(module.isNeeded) missingNeeded = true
        }
    })
    if(failedModules != "") {
        Game.Notify('AutoCookie prompt', 'Unable to load dependencies--'+failedModules, [32, 0]);
    }
    if(missingNeeded) {
        Game.Notify('AutoCookie error', 'Shutting down AutoCookie since a necessary dependency was not found', [32, 0]);
        return
    } else if(missingNeeded) {
        Game.Notify('AutoCookie warning', 'Resuming AutoCookie, but some features might be disabled', [32, 0]);
    }
    
    Game.registerMod("autoCookie", {
        init:function() {
            AutoCookie.startScript();
    
            if(!Game.HasAchiev('Cookie-dunker') || !Game.HasAchiev('Stifling the press')) Game.Notify('AutoCookie Prompt', "Please make sure the window is not maximized, so the bot can get 'Cookie-dunker' and 'Stifling the press'. This should be the only time user-input be required", [11,14])
    
            if(AutoCookie.interval != 0) Game.Notify(`AutoCookie successfully loaded!`,'',[16,5])
            else Game.Notify(`Unable to load AutoCookie`,'',[16,5])
        },
        save:function() {},
        load:function() {},
    })
}
if(AutoCookie === undefined) var AutoCookie = {};

AutoCookie.DEV = false
AutoCookie.modVersion = 5
AutoCookie.gameVersion = 2.052

{
    let interval = 0
    let baseURL = 'https://github.com/NotWhiteRice/AutoCookie/blob/main/'
    let scripts = [
        baseURL+'autocookie-menuing.js',
        baseURL+'autocookie-main.js'
    ]

    let loadScript = function(index) {
        if(index >= scripts.length) startAutoCookie()
        else {
            let url = scripts[index]
            if(/\.js$/.exec(url)) {
                $.getScript(url, () => loadScript(index+1))
            }
        }
    }

    interval = setInterval(function () {
        if (Game && Game.ready) {
            clearInterval(interval)
            interval = 0
            if(Game.version != AutoCookie.gameVersion) Game.Notify('ACLoader--version mismatch', `AutoCookie was created for Cookie Clicker v${AutoCookie.gameVersion} and may not work as intended.`, [32, 0])
            startLoader()
        }
    }, 1000);

    let startLoader = function() {
        Game.Notify('ACLoader--fetching dependencies', `Fetching ${scripts.length+1} dependencies`, [32, 0])

        let jquery = document.createElement('script')
        jquery.setAttribute("type", "text/javascript")
        jquery.setAttribute('src', 'https://code.jquery.com/jquery-3.7.1.min.js')
        jquery.setAttribute('integrity', 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=')
        jquery.setAttribute('crossorigin', 'anonymous')
        jquery.onload = function() { loadScript(0) }

        document.appendChild(jquery)
    }

    let startAutoCookie = function() {
        Game.registerMod("autoCookie", {
            init:function() {
                interval = setInterval(AutoCookie.tick, 1);

                if(!Game.HasAchiev('Cookie-dunker') || !Game.HasAchiev('Stifling the press')) Game.Notify('AutoCookie Prompt', !!App ? "Please make sure the window is not maximized, so the bot can get 'Cookie-dunker' and 'Stifling the press'. This should be the only time user-input be required" : "AutoCookie is unable to get 'Cookie-dunker' or 'Stifling the press' unless launched on the Steam version of Cookie Clicker", [11,14])

                if(AutoCookie.isRunning()) Game.Notify(`AutoCookie v${AutoCookie.gameVersion}.${AutoCookie.modVersion} successfully loaded!`,'',[16,5])
                else Game.Notify(`Unable to load AutoCookie v${AutoCookie.gameVersion}.${AutoCookie.modVersion}`,'',[16,5])
            },
            save:function() {},
            load:function() {},
        })
    }

    AutoCookie.isRunning = function() { return interval != 0 }

    AutoCookie.kill = function() {
        if(interval != 0) {
            clearInterval(interval)
            interval = 0
        }
        
        Game.Notify('AutoCookie ended peacefully', '', [32, 0])
    }
}
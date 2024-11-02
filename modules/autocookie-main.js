{
    let trackedClicks = []
    let secsToTrackClicks = 5
    let runningClicks = 0
    let clicksClock = 0
    let clicksPerSecond = 0

    AutoCookie.isOnMainScreen = function() {
        return Game.promptOn == 0 && Game.OnAscend == 0
    }

    AutoCookie.tick = function() {
        if(AutoCookie.errorCode != 0) {
            AutoCookie.pauseBot = true
            AutoCookie.kill()
            return
        }

        if(AutoCookie.hasDependency(`autocookie-menuing.js`)) {
            AutoCookie.getMiscAchievs()
            AutoCookie.fixBakeryName()
        }

        if(Date.now() > clicksClock + 1000) {
            clicksClock = Date.now()
            trackedClicks.push(runningClicks)
            runningClicks = 0
            while(trackedClicks.length > secsToTrackClicks) trackedClicks.shift()
            clicksPerSecond = 0
            for(const val of trackedClicks) clicksPerSecond += val
            clicksPerSecond /= trackedClicks.length
        }

        if(AutoCookie.isOnMainScreen()) {
            if((Game.HasAchiev(`Neverclick`) && Game.HasAchiev(`True Neverclick`)) || (Game.ascensionMode==0 && Game.resets!=0) || Game.cookiesEarned > 1000000) {
                runningClicks++
                Game.ClickCookie()
            }

            if(Game.cookies >= Game.Objects.Grandma.price && !Game.HasAchiev(`Just wrong`) && Game.Objects.Grandma.amount >= 1) Game.Objects.Grandma.sell(1)

            Game.shimmers.forEach(function(shimmer) {
                if(shimmer.type == "golden" && shimmer.wrath == 0) {
                    if(Game.HasAchiev('Fading luck')) shimmer.pop()
                    else if(shimmer.life < 30) shimmer.pop()
                } else if(shimmer.type == "golden" && !Game.HasAchiev('Wrath cookie')) shimmer.pop()
            })
        }
    }
}
{
    let trackedClicks = []
    let secsToTrackClicks = 5
    let runningClicks = 0
    let clicksClock = 0

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
        }

        if(AutoCookie.isOnMainScreen()) {
            let clickLimit = -1, cookieLimit = -1, timeLimit = -1
            if(!Game.HasAchiev(`Speed baking I`)) timeLimit = 35
            if(!Game.HasAchiev(`Speed baking II`)) timeLimit = 25
            if(!Game.HasAchiev(`Speed baking III`)) timeLimit = 15
            if(timeLimit != -1) cookieLimit = 1000000
            if(!Game.HasAchiev(`Neverclick`) && Game.cookieClicks <= 15) clickLimit = 15
            if(!Game.HasAchiev(`True Neverclick`) && Game.cookieClicks == 0) clickLimit = 0
            if(clickLimit != -1) {
                cookieLimit = 1000000
                timeLimit = -1
            }
            if(!Game.HasAchiev(`Hardcore`)) {
                cookieLimit = 1000000000
                timeLimit = -1
            }

            if((Game.ascensionMode==0 && Game.resets!=0) || Game.cookiesEarned > 1100000 || Game.cookieClicks > clickLimit) {
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

    AutoCookie.clicksPerSec = function() {
        let clicksPerSecond = 0
        for(const val of trackedClicks) clicksPerSecond += val
        clicksPerSecond /= trackedClicks.length
        return clicksPerSecond;
    }
}
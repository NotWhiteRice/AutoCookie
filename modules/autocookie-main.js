/*
-----------------------------------------------
    Rather annoying deprecated garden script
-----------------------------------------------


AutoCookie.interval = 0
AutoCookie.pauseBots = false
AutoCookie.killBots = false

AutoCookie.onInit = function() {
    if(AutoCookie.hasModule('bot-garden.js')) AutoCookie.interval = setInterval(AutoCookie.gardenHelper.tick, 1000)

    if(AutoCookie.interval != 0) Game.Notify(`AutoCookie successfully loaded!`,'',[16,5])
    else Game.Notify(`Unable to load AutoCookie`,'',[16,5])

    Game.Notify('Notice', 'AutoCookie requires menus be closed at this time', [32,0])
}
*/

{
    let trackedClicks = []
    let secsToTrackClicks = 5
    let runningClicks = 0
    let clicksClock = 0
    let goal = "Cursor"

    let calcBuildingPayout = function(building) {
        let price = building.price
        let gain = building.cps(building)
        return (price/gain) + (Math.max(price-Game.cookies, 0)/Game.cookiesPs)
    }

    AutoCookie.isOnMainScreen = function() {
        return Game.promptOn == 0 && Game.OnAscend == 0
    }

    AutoCookie.isHardcore = function() {
        return AutoCookie.isOnMainScreen() && (Game.ascensionMode==1 || Game.resets==0) && !Game.HasAchiev(`Hardcore`) && Game.UpgradesOwned == 0
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
            if(Game.ascensionMode==1 || Game.resets==0) {
                if(!Game.HasAchiev(`Speed baking I`)) timeLimit = 35
                if(!Game.HasAchiev(`Speed baking II`)) timeLimit = 25
                if(!Game.HasAchiev(`Speed baking III`)) timeLimit = 15
                if(!Game.HasAchiev(`Neverclick`) && Game.cookieClicks <= 15) clickLimit = 15
                if(!Game.HasAchiev(`True Neverclick`) && Game.cookieClicks == 0) clickLimit = 0
                if(clickLimit != -1) timeLimit = -1
                if(!Game.HasAchiev(`Hardcore`) && Game.UpgradesOwned == 0) timeLimit = -1
            }

            if((Game.ascensionMode==0 && Game.resets!=0) || Game.cookiesEarned > 1100000 || Game.cookieClicks != clickLimit) {
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

            if(Game.cookiesPs != 0) {
                let bestPayout = 0
                let sendPrompt = false
                if(goal != "") bestPayout = calcBuildingPayout(Game.Objects[AutoCookie.bestPurchase])
                Object.values(Game.Objects).forEach(function(building) {
                    let payout = calcBuildingPayout(building)
                    if(payout < bestPayout || bestPayout == 0) {
                        bestPayout = payout
                        goal = building.name
                        sendPrompt = true
                    }
                })
            }
    
            if(goal != "") {
                let building = Game.Objects[goal]
                if(Game.cookies >= building.price) building.buy(1)
            }

            //Ascend with challenges enabled if above the time limit
        }
    }

    AutoCookie.clicksPerSec = function() {
        let clicksPerSecond = 0
        for(const val of trackedClicks) clicksPerSecond += val
        clicksPerSecond /= trackedClicks.length
        return clicksPerSecond;
    }

    AutoCookie.bestPurchase = function() {
        return goal
    }
}
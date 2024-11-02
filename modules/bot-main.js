/*
-----------------------------------------------
    Rather annoying unfinished garden script
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

/*
---------------------------------------------------------
   Crude script with auto-buy and getting miscellaneous achievements
---------------------------------------------------------
*/
AutoCookie.interval = 0;
AutoCookie.pauseBot = false;
AutoCookie.killBot = false;
AutoCookie.dunkTimer = 0;
AutoCookie.windowW = 0;
AutoCookie.windowH = 0;
AutoCookie.bestPurchase = "";
AutoCookie.purchaseType = "";

AutoCookie.testCPS = false
AutoCookie.isTesting = false

AutoCookie.onInit = function() {
    AutoCookie.interval = setInterval(AutoCookie.runScript, 1);

    if(!Game.HasAchiev('Cookie-dunker') || !Game.HasAchiev('Stifling the press')) Game.Notify('AutoCookie Prompt', "Please make sure the window is not maximized, so the bot can get 'Cookie-dunker' and 'Stifling the press'. This should be the only time user-input be required", [11,14])
    
    if(AutoCookie.interval != 0) Game.Notify(`AutoCookie v${AutoCookie.gameVersion}.${AutoCookie.modVersion} successfully loaded!`,'',[16,5])
    else Game.Notify(`Unable to load AutoCookie`,'',[16,5])
}

AutoCookie.calcBuildingPayout = function(building) {
    let price = building.price
    let gain = building.cps(building)
    return (price/gain) + (Math.max(price-Game.cookies, 0)/Game.cookiesPs)
}

AutoCookie.runScript = function() {
    if(AutoCookie.killBot) {
        clearInterval(AutoCookie.interval)
        AutoCookie.interval = 0
        return
    }
    if(AutoCookie.pauseBot) return

    AutoCookie.tick()

    if(AutoCookie.isOnMainScreen()) {
        if(Game.shimmers.length > 0) AutoCookie.clickGCs()
        if(AutoCookie.hasDependency(`autocookie-menuing.js`)) {
            AutoCookie.getMiscAchievs()
            AutoCookie.fixBakeryName()
        }

        if(AutoCookie.testCPS) {
            let timeout = 0
            if(!AutoCookie.isTesting) {
                timeout = setTimeout(() => {AutoCookie.testCPS = false}, 1000)
                AutoCookie.isTesting = true
            }
            Game.ClickCookie()
        }

        if(Game.cookiesPs > 100 && !Game.HasAchiev(`Just wrong`)) {
            if(Game.Objects.Grandma.amount >= 1) Game.Objects.Grandma.sell(1)
        }

        if(Game.cookiesPs == 0) {
            AutoCookie.bestPurchase = "Cursor"
            AutoCookie.purchaseType = "Building"
        } else {
            let bestPayout = 0
            let sendPrompt = false
            if(AutoCookie.purchaseType == "Building" && AutoCookie.bestPurchase != "") bestPayout = AutoCookie.calcBuildingPayout(Game.Objects[AutoCookie.bestPurchase])
            Object.values(Game.Objects).forEach(function(building) {
                let payout = AutoCookie.calcBuildingPayout(building)
                if(payout < bestPayout || bestPayout == 0) {
                    bestPayout = payout
                    AutoCookie.purchaseType = "Building"
                    AutoCookie.bestPurchase = building.name
                    sendPrompt = true
                }
            })
            //if(sendPrompt) Game.Notify("AutoCookie prompt", "Waiting to purchase " + AutoCookie.bestPurchase, [6,6])
        }

        if(AutoCookie.purchaseType == "Building" && AutoCookie.bestPurchase != "") {
            if(Game.cookies >= Game.Objects[AutoCookie.bestPurchase].price) Game.Objects[AutoCookie.bestPurchase].buy(1)
        }        
    }
}

AutoCookie.clickGCs = function() {
    Game.shimmers.forEach(function(shimmer) {
        if(shimmer.type == "golden" && shimmer.wrath == 0) {
            if(Game.HasAchiev('Fading luck')) shimmer.pop()
            else if(shimmer.life < 30) shimmer.pop()
        } else if(shimmer.type == "golden" && !Game.HasAchiev('Wrath cookie')) shimmer.pop()
    })
}
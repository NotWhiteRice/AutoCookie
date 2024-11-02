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
AutoCookie.pauseBot = false;
AutoCookie.bestPurchase = "";
AutoCookie.purchaseType = "";

AutoCookie.testCPS = false
AutoCookie.isTesting = false

AutoCookie.calcBuildingPayout = function(building) {
    let price = building.price
    let gain = building.cps(building)
    return (price/gain) + (Math.max(price-Game.cookies, 0)/Game.cookiesPs)
}

AutoCookie.runScript = function() {
    if(AutoCookie.pauseBot) return

    AutoCookie.tick()

    if(AutoCookie.isOnMainScreen()) {
        if(Game.shimmers.length > 0) AutoCookie.clickGCs()

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
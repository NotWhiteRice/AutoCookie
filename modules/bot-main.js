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

AutoCookie.calcBuildingPayout = function(building) {
    let price = building.price
    let gain = building.cps(building)
    return (price/gain) + (Math.max(price-Game.cookies, 0)/Game.cookiesPs)
}

AutoCookie.runScript = function() {
    if(AutoCookie.pauseBot) return

    AutoCookie.tick()

    if(AutoCookie.isOnMainScreen()) {
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
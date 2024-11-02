if(AutoCookie.gardenHelper === undefined) AutoCookie.gardenHelper = {}

AutoCookie.gardenHelper.goal = "pending"
AutoCookie.gardenHelper.desiredSoil = 0

AutoCookie.gardenHelper.hasSeed = function(seed, minigame) {
    if(!Object.keys(minigame.plants).includes(seed)) {
        console.log(`[AutoCookie] Found invalid seed--'${seed}'`)
        return false;
    }
    return minigame.plants[seed].unlocked == 1
}

AutoCookie.gardenHelper.computeGoal = function(instance, minigame) {
    //Chocoroot
    if(!instance.hasSeed("meddleweed", minigame)) return "meddleweed"
    if(!instance.hasSeed("crumbspore", minigame)) return "crumbspore"
    if(!instance.hasSeed("brownMold")) return "brownMold"
    if(!instance.hasSeed("whiteMildew")) return "whiteMildew" // 0.5 -- brownMold
    if(!instance.hasSeed("chocoroot")) return "chocoroot" // 0.1 -- browmMold+bakerWheat
    if(!instance.hasSeed("whiteChocoroot")) return "whiteChocoroot" // 0.1 -- chocoroot+whiteMildew

    //Clover + Queenbeet
    if(!instance.hasSeed("thumbcorn")) return "thumbcorn" // 0.05 -- bakerWheat+bakerWheat
    if(!instance.hasSeed("bakeberry")) return "bakeberry" // 0.001 -- bakerWheat+bakerWheat
    if(!instance.hasSeed("queenbeet")) return "queenbeet" // 0.01 -- bakeberry+chocoroot
    if(!instance.hasSeed("cronerice")) return "cronerice" // 0.01 -- bakerWheat+thumbcorn
    if(!instance.hasSeed("gildmillet")) return "gildmillet" // 0.03 -- cronerice+thumbcorn
    if(!instance.hasSeed("clover")) return "clover" // 0.03 -- gildmillet+bakerWheat
    if(!instance.hasSeed("goldenClover")) return "goldenClover" // 0.0007 -- gildmillet+bakerWheat

    //Niche seeds
    if(!instance.hasSeed("wrinklegill")) return "wrinklegill" // 0.06 crumbspore+brownMold
    if(!instance.hasSeed("glovemorel")) return "glovemorel" // 0.02 -- crumbspore+thumbcorn
    if(!instance.hasSeed("shimmerlily")) return "shimmerlily" // 0.02 -- clover+gildmillet
    if(!instance.hasSeed("cheapcap")) return "cheapcap" // 0.04 -- shimmerlily+crumbspore
    if(!instance.hasSeed("whiskerbloom")) return "whiskerbloom" // 0.01 -- whiteChocoroot+shimmerlily
    if(!instance.hasSeed("nursetulip")) return "nursetulip" // 0.05 -- whiskerbloom+whiskerbloom
    if(!instance.hasSeed("chimerose")) return "chimerose" // 0.05 -- whiskerbloom+shimmerlily
    if(!instance.hasSeed("doughshroom")) return "doughshroom" // 0.005
    if(!instance.hasSeed("greenRot")) return "greenRot" // 0.05 -- clover+whiteMildew
    if(!instance.hasSeed("keenmoss")) return "keenmoss" // 0.1 greenRot+brownMold
    if(!instance.hasSeed("foolBolete")) return "foolBolete" // 0.04 --doughshroom+greenrot

    //Advanced niche seeds
    if(!instance.hasSeed("wardlichen")) return "wardlichen" // 0.005
    if(!instance.hasSeed("drowsyfern")) return "drowsyfern" // 0.005 -- keenmoss+chocoroot

    //Endgame seeds
    if(!instance.hasSeed("queenbeetLump")) return "queenbeetLump" // 0.01 -- queenbeet x 8
    if(!instance.hasSeed("duketater")) return "duketater" // 0.001 -- queenbeet+queenbeet
    if(!instance.hasSeed("shriekbulb")) return "shriekbulb" // 0.005 -- duketater x 3
    if(!instance.hasSeed("elderwort")) return "elderwort" // 0.01 -- shimmerlily+cronerice
    if(!instance.hasSeed("ichorpuff")) return "ichorpuff" // 0.002 -- elderwort+crumbspore
    if(!instance.hasSeed("tidygrass")) return "tidygrass" // 0.002 -- whiteChocoroot+bakerWheat
    if(!instance.hasSeed("everdaisy") && Game.Objects.Farm.level >= 3) return "everdaisy" // 0.002 tidygrass x 3 + elderwort x 3

    return "pending"
}

AutoCookie.gardenHelper.computeDesiredSoil = function(instance, minigame) {
    const farms = Game.Objects.Farm.amount
    if(instance.goal == "meddleweed" && farms >= 50) return 1
    return 0
}

AutoCookie.gardenHelper.tick = function() {
    if(AutoCookie.pauseBot) return
    let instance = AutoCookie.gardenHelper
    let minigame = Game.Objects.Farm.minigame

    if(Game.onMenu != '' || Game.OnAscend != 0 || Game.promptOn != 0) return;
    
    Game.Objects.Farm.mute(false)

    let farmElement = document.querySelector("#wrapper #game #sectionMiddle #centerArea #rows #row2")
    if(!Game.Objects.Farm.onMinigame) farmElement.querySelector(".productButtons #productMinigameButton2").click()

    let gameElement = farmElement.querySelector("#rowSpecial2 #gardenContent")
    let soilSelectionElement = gameElement.querySelector("#gardenField #gardenSoils")

    instance.goal = instance.computeGoal(instance, minigame)
    instance.desiredSoil = instance.computeDesiredSoil(instance, minigame)

    if(minigame.nextSoil <= Date.now()) soilSelectionElement.querySelector(`#gardenSoil-${instance.desiredSoil}`).click()

    if(instance.goal == "meddleweed") {}
}
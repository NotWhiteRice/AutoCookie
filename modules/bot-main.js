AutoCookie.interval = 0;
AutoCookie.pauseBot = false;
AutoCookie.killBot = false;
AutoCookie.dunkTimer = 0;
AutoCookie.windowW = 0;
AutoCookie.windowH = 0;
AutoCookie.bestPurchase = "";
AutoCookie.purchaseType = "";

AutoCookie.startScript = function() {
    AutoCookie.interval = setInterval(AutoCookie.runScript, 1);
}

AutoCookie.onMainScreen = function() {
    return Game.OnAscend == 0 || Game.promptOn == 0
}

AutoCookie.openMenu = function(name) {
    if(Game.onMenu === name || !AutoCookie.onMainScreen()) return
    let buttons = document.body.children['wrapper'].children['game'].children['sectionMiddle'].children['comments'];
    switch(name) {
        case '':
            AutoCookie.openMenu(Game.onMenu)
            break;
        case 'prefs':
            buttons.children['prefsButton'].click()
            break;
        case 'stats':
            buttons.children['statsButton'].click()
            break;
        case 'log':
            buttons.children['logButton'].click()
            break;
    }
}

AutoCookie.clickNewsTicker = function() {
    if(!AutoCookie.onMainScreen()) return
    document.body.children['wrapper'].children['game'].children['sectionMiddle'].children['comments'].children['commentsText'].children['commentsText1'].click()
}

AutoCookie.calcBuildingPayout = function(building) {
    let cps = Game.cookiesPs
    let price = building.price
    let gain = building.cps(building)
    return (price/gain) + (price/cps)
}

AutoCookie.runScript = function() {
    if(AutoCookie.killBot) {
        clearInterval(AutoCookie.interval)
        AutoCookie.interval = 0
        return
    }
    if(AutoCookie.pauseBot) return

    if(AutoCookie.onMainScreen()) {
        if(Game.shimmers.length > 0) AutoCookie.clickGCs()
        AutoCookie.navigateMenus()

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
            if(sendPrompt) Game.Notify("AutoCookie prompt", "Waiting to purchase " + AutoCookie.bestPurchase, [6,6])
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

AutoCookie.navigateMenus = function() {
    const activeMenu = Game.onMenu;
    if(!Game.HasAchiev('Tiny cookie') || !Game.HasAchiev('Here you go')) {
        AutoCookie.openMenu('stats')
        let statsPage = document.body.children['wrapper'].children['game'].children['sectionMiddle'].children['centerArea'].children['menu']
        let statsSections = statsPage.getElementsByClassName("subsection")
        let generalStats = undefined
        let achievements = undefined
        for(const section of statsSections) {
            if(section.getElementsByClassName("title")[0].innerHTML == "General") generalStats = section
            if(section.getElementsByClassName("title")[0].innerHTML == "Achievements") achievements = section  
        }
        if(generalStats === undefined) {} else if(!Game.HasAchiev('Tiny cookie')) generalStats.children['statsGeneral'].getElementsByClassName("listing")[0].getElementsByClassName("price plain")[0].getElementsByClassName("tinyCookie")[0].click()
        if(achievements === undefined) {} else if(!Game.HasAchiev('Here you go')) for(const achiev of achievements.children['statsAchievs'].getElementsByClassName("listing crateBox")[0].children) { achiev.click() }
    }
    if(!Game.HasAchiev('Olden days')) {
        AutoCookie.openMenu('log')
        document.body.children['wrapper'].children['game'].children['sectionMiddle'].children['centerArea'].children['menu'].children['oldenDays'].getElementsByClassName("icon")[0].click()
    }
    if(Game.onMenu != activeMenu) AutoCookie.openMenu(activeMenu);
    if(!Game.HasAchiev('Cookie-dunker') || !Game.HasAchiev('Stifling the press')) {
        if(AutoCookie.dunkTimer == 0) {
            AutoCookie.windowW = window.outerWidth;
            AutoCookie.windowH = window.outerHeight;
        }
        if(window.screenX != 0 || window.screenY != 0) {
            window.resizeTo(690, 210)
            Game.resize()
            if(!Game.HasAchiev('Stifling the press')) AutoCookie.clickNewsTicker();
            if(Game.HasAchiev('Cookie-dunker')) {
                window.resizeTo(AutoCookie.windowW, AutoCookie.windowH)
                Game.resize()
            } else AutoCookie.dunkTimer++
        }
    }
    if(Game.HasAchiev('Cookie-dunker') && Game.HasAchiev('Stifling the press') && AutoCookie.dunkTimer > 0) {
        AutoCookie.dunkTimer = 0;
        window.resizeTo(AutoCookie.windowW, AutoCookie.windowH)
        Game.resize()
    }

    if(!Game.HasAchiev('Tabloid addiction')) {
        for(i = 0; i < 50; i++) AutoCookie.clickNewsTicker();
    }
    if(!Game.HasAchiev('God complex') || !Game.HasAchiev("What's in a name")) {
        const bakery = Game.bakeryName
        Game.bakeryNameL.click()
        document.activeElement.value="Orteil"
        Game.promptL.getElementsByClassName("optionBox")[0].children['promptOption0'].click()
        Game.bakeryNameL.click()
        document.activeElement.value=bakery
        Game.promptL.getElementsByClassName("optionBox")[0].children['promptOption0'].click()
    }
    if(Game.bakeryName == "Orteil") {
        Game.bakeryNameL.click()
        document.activeElement.value=Game.GetBakeryName()
        Game.promptL.getElementsByClassName("optionBox")[0].children['promptOption0'].click()
    }
}

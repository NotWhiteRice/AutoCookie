/*
----------------------------------------------------------------
- The AutoCookie module that handles interacting with the HTML -
----------------------------------------------------------------
*/
{
    let dunkClock = 0, windowW, windowH, STPtries = 0

    let openMenu = function(menu) {
        if(Game.onMenu === menu) return
        let menuButtons = document.querySelector(`#wrapper #game #sectionMiddle #comments`)
        switch(menu) {
            case '':
                menuButtons.querySelector(`#${Game.onMenu}Button`).click()
                break;
            case 'prefs':
                menuButtons.querySelector(`#prefsButton`).click()
                break;
            case 'stats':
                menuButtons.querySelector(`#statsButton`).click()
                break;
            case 'log':
                menuButtons.querySelector(`#logButton`).click()
                break;
        }
    }

    let renameBakery = function(name) {
        Game.bakeryNameL.click()
        document.activeElement.value=name
        Game.promptL.querySelector(`.optionBox #promptOption0`).click()
    }

    AutoCookie.openMenu = function(menu) {
        if(AutoCookie.isOnMainScreen()) openMenu(menu)
    }

    AutoCookie.clickNewsTicker = function() {
        if(!AutoCookie.isOnMainScreen()) return
        document.querySelector(`#wrapper #game #sectionMiddle #comments #commentsText #commentsText1`).click()
    }

    AutoCookie.fixBakeryName = function() {
        if(Game.bakeryName != `Orteil` || !AutoCookie.isOnMainScreen()) return
        renameBakery(Game.GetBakeryName())
    }
    
    AutoCookie.getMiscAchievs = function() {
        if(!AutoCookie.isOnMainScreen()) return
        const oldMenu = Game.onMenu

        // Getting the achievements from the 'stats' menu
        if(!Game.HasAchiev(`Tiny cookie`) || !Game.HasAchiev(`Here you go`)) {
            openMenu(`stats`)
            let sections = document.querySelectorAll(`#wrapper #game #sectionMiddle #centerArea #menu .subsection`)
            let generalStats, achievements

            for(const section of sections) {
                const title = section.querySelector(`.title`)?.innerHTML
                if(title == `General`) generalStats = section
                else if(title == `Achievements`) achievements = section
            }
            if(generalStats != undefined && !Game.HasAchiev(`Tiny cookie`)) for(const listing of generalStats.querySelectorAll(`#statsGeneral .listing`)) { listing.querySelector(`.price.plain .tinyCookie`)?.click() }
            if(achievements != undefined && !Game.HasAchiev(`Here you go`)) for(const section of achievements.querySelectorAll(`#statsAchievs .listing.crateBox`)) { for(const achiev of section.children) { achiev.click() }}
        }

        // Getting the achievements from the 'log' menu
        if(!Game.HasAchiev(`Olden days`)) {
            openMenu(`log`)
            document.querySelector(`#wrapper #game #sectionMiddle #centerArea #menu #oldenDays .icon`).click()
        }

        // Restoring the previously open menu
        if(Game.onMenu != oldMenu) openMenu(oldMenu)

        // Making the window smaller to get 'Cookie-dunker' and 'Stifling the press'
        if(!Game.HasAchiev(`Cookie-dunker`) || !Game.HasAchiev(`Stifling the press`)) {
            if(dunkClock == 0 && STPtries == 0) {
                windowW = window.outerWidth;
                windowH = window.outerHeight;
            }
            if((window.screenX != 0 || window.screenY != 0) && STPtries < 10) {
                window.resizeTo(690, 210)
                Game.resize()
                if(!Game.HasAchiev(`Stifling the press`)) AutoCookie.clickNewsTicker();
                if(Game.HasAchiev(`Cookie-dunker`)) {
                    STPtries++
                    window.resizeTo(windowW, windowH)
                    Game.resize()
                } else dunkClock++
            }
            if(STPtries == 10 && !Game.HasAchiev(`Stifling the press`)) {
                Game.Notify(`AutoCookie prompt`, `Unable to obtain 'Stifling the press'--please report this on the Steam workshop page or GitHub repo`, [])
            }
        }

        // Restoring the old window size if not done already
        if(Game.HasAchiev(`Cookie-dunker`) && Game.HasAchiev(`Stifling the press`) && dunkClock > 0) {
            dunkClock = 0;
            window.resizeTo(windowW, windowH)
            Game.resize()
        }    

        // Getting 'Tabloid addiction'
        if(!Game.HasAchiev(`Tabloid addiction`)) for(i = 0; i < 50; i++) AutoCookie.clickNewsTicker();

        // Getting 'God complex' and "What's in a name"
        if(!Game.HasAchiev(`God complex`) || !Game.HasAchiev(`What's in a name`)) {
            const oldName = Game.bakeryName
            renameBakery(`Orteil`)
            renameBakery(oldName)
        }
    }
}
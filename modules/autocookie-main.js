{
    AutoCookie.isOnMainScreen = function() {
        return Game.promptOn == 0 && Game.OnAscend == 0
    }

    AutoCookie.tick = function() {
        if(AutoCookie.errorCode != 0) {
            AutoCookie.killBot = true
            AutoCookie.kill()
            return
        }

        if(AutoCookie.hasDependency(`autocookie-menuing.js`)) {
            AutoCookie.getMiscAchievs()
            AutoCookie.fixBakeryName()
        }
    }
}
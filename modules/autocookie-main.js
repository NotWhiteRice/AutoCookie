{
    AutoCookie.isOnMainScreen = function() {
        return Game.promptOn == 0 && Game.OnAscend == 0
    }

    AutoCookie.tick = function() {
        if(AutoCookie.errorCode != 0) AutoCookie.killBot = true
    }
}
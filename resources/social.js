var social = {

    facebook: {

        url: "https://www.facebook.com/dialog/share",

        params: {
            app_id: analyticsConfig.facebook,
            href: "https://octo.bestmacsoft.com/landings/01",
            redirect_uri: "",
            display: "popup",
            mobile_iframe: "false",

            quote: "Hello Octo! You're absolutely awesome",
        }

    },

    twitter: {

        url: "https://twitter.com/intent/tweet",

        params: {
            url: "https://octo.bestmacsoft.com/landings/01",
            via: "Ocoto_messenger",

            text: "<3 Octo. Simply the best",
        }
    },

}

// Generate Share links
var socialEncoded = function () {

    var obj = {}

    for (var s in social) {

        var str = social[s].url + "?"
        for (var p in social[s].params) {

            str += p + "=" + encodeURIComponent(social[s].params[p]) + "&"
        }

        obj[s] = str
    }

    return obj
}();

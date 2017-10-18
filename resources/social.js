var social = {

    facebook: {

        url: "https://www.facebook.com/dialog/share",

        params: {
            app_id: '',
            u: "https://octo.com",
            quote: "Hello GB",
            redirect_uri: "",
        }

    },

    twitter: {

        url: "https://twitter.com/intent/tweet",

        params: {
            url: "https:/oco",
            via: "@Ocoto_messenger",
            text: "don't think",
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

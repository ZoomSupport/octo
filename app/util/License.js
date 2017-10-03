Ext.define('Rambox.util.License', {
     singleton: true

    ,requires: [
        "Rambox.util.MD5",
        "Ext.util.JSON",
    ]

    ,server: "http://stage-account.getadwarebuster.com"

    ,secret: "test"

    ,softBundle: "com.zoomsupport.octo"
    ,softVersion: "0.1.0"

    ,genSignature: function (obj) {
        let keys = Object.keys(obj)
        keys = keys.sort()

        var str = ""
        keys.forEach(function (i) {
            str += obj[i]
        })
        str += this.secret

        return Rambox.util.MD5.encypt(str)
    }

    ,checkLicense: function (suc, err) {
        console.log("[EVENT] Checking license");

        const info = ipc.sendSync('getSysInfo') // Request system info from electron

        // Process system info
        console.log("[EVENT] System information received");

        let params = {
            macAddress: info.macAddress,

            serial: info.serial,
            modelId: info.modelId,
            osVersion: info.osVersion,

            softBundle: this.softBundle,
            softVersion: this.softVersion,
        }

        params.signature = this.genSignature(params)

        console.log(params)

        Ext.Ajax.request({
            url: this.server + "/api/v1/license/info",
            method: "POST",

            aync: true,

            params: params,

            success: function (res) {
                const r = Ext.util.JSON.decode(res.responseText)

                console.info ("[LICENSE REQUEST START]")
                console.info (r)

                localStorage.setItem("licenseData", res.responseText)

                if (r.statusCode === 0) {
                    localStorage.setItem('activated', r.hasLicense)
                } else {
                    if (err) err(r)
                    return
                }
                
                if (suc) suc(r)
            },

            err: function (res) {
                console.error("[LICENSE REQUEST ERROR] " + res)
                err(res);
            }

        })

    },

    activateByKey: function (key, suc, err) {

        const info = ipc.sendSync('getSysInfo') // Request system info from electron
        
        let params = {
            activationKey: key,

            macAddress: info.macAddress,
            serial: info.serial,
            softBundle: this.softBundle, 
        }
        params.signature = this.genSignature(params)

        console.log(params)

        Ext.Ajax.request({
            url: this.server+"/api/v1/license/createByActivationKey",
            method: "POST",

            aync: true,

            params: params,

            success: function (res) {
                console.log(res)
                // suc();
                // if (suc) suc(r)
            },

            err: function (e) {
                console.log(res)
                // err(e);
            }

        })

    }
})
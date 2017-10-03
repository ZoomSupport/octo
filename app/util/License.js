Ext.define('Rambox.util.License', {
     singleton: true

    ,requires: [
        "Rambox.util.MD5",
        "Ext.util.JSON",
    ]

    ,server: "http://stage-account.getadwarebuster.com/"

    ,secret: "TEST"
    ,softBundle: "com.zoomsupport.octo"
    ,softVersion: "0.1.0"

    ,checkLicense: function (suc, err) {
        console.log("[EVENT] Checking license");

        const info = ipc.sendSync('getSysInfo') // Request system info from electron

        // Process system info
        console.log("[EVENT] System information received");

        const secret = "test"
        const softBundle = "com.zoomsupport.octo"
        const softVersion = "0.1.0"

        const params = {
            macAddress: info.macAddress,

            serial: info.serial,
            modelId: info.modelId,
            osVersion: info.osVersion,

            softBundle: softBundle, //this.softBundle,
            softVersion: softVersion, //this.softVersion,

            signature: Rambox.util.MD5.encypt(
                info.macAddress + info.modelId + info.osVersion + info.serial + softBundle + softVersion + secret
            )
        }

        console.log(params)

        Ext.Ajax.request({
            url: "http://stage-account.getadwarebuster.com/api/v1/license/info",
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

        ipc.send('getSysInfo') // Request system info from electron
        
        // Process system info
        ipc.on('sysInfo', function (e, info) {

            const secret = "test"
            const softBundle = "com.zoomsupport.octo"
            const softVersion = "0.1.0"

            const params = {
                activationKey: key,

                macAddress: info.macAddress,
                serial: info.serial,
                softBundle: softBundle, //this.softBundle,

                signature: Rambox.util.MD5.encypt(
                    info.macAddress + info.modelId + info.osVersion + info.serial + softBundle + softVersion + secret
                )
            }

            console.log(params)

            Ext.Ajax.request({
                url: "http://stage-account.getadwarebuster.com/api/v1/license/info",
                method: "POST",

                aync: true,

                params: params,

                success: function (res) {
                    console.log(res)
                    suc();
                },

                err: function (e) {
                    console.log(res)
                    err(e);
                }

            })

        })
    }
})
Ext.define('Rambox.util.License', {
     singleton: true

    ,requires: [
        "Rambox.util.MD5"
    ]

    ,check: function () {

        return new Ext.Promise(function (res, rej) {

            ipc.send('getSysInfo') // Request system info from electron

            // Process system info
            ipc.on('sysInfo', function (e, info) {
                console.log(e, info)

                const params = {
                    macAddress: info.macAddress,
                    serial: info.serial,
                    modelId: info.modelId,
                    osVersion: info.osVersion,
                    softBundle: "com.inifieder",
                    softVersion: "1.0.0",
                    // signature: Rambox.util.MD5.encypt()
                }

                console.log(params)

            })
        })
    }
})
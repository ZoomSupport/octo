Ext.define('Rambox.util.License', {
    singleton: true,

    check: function () {
        ipc.send('getSysInfo')
		ipc.on('sysInfo', function (e, data) {
			console.log(e, data)
		})
    }
})
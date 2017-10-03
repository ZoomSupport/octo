// const upgrade = {
// 	icon: 'resources/tools/upgrade.png',

// 	id: 'upgradeTab',
// 	closable: false,
// 	reorderable: false,

// 	tabConfig: {
// 		cls: 'b-icon',
// 		handler: 'notButton',
// 	},
// }


Ext.define('Rambox.view.popup.PopupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.popup-popup',

    requestTimeout: null,
    timeoutTime: 5000,
    externalURL: 'https://zeoalliance.com',

    doUpgrade: function (btn) {

        this.upgradeSuccess();

        ipc.send("openExternalLink", this.externalURL)

        // Enable Spinner view
        this.getView().getComponent('buy-popup').setHidden(true)
        this.getView().getComponent('buy-spinner').setHidden(false)

        this.requestTimeout = setInterval(this.requestLoop, this.timeoutTime)
    },

    requestLoop: function () {
        console.log("LOOPING REQUEST")

        Rambox.util.License.checkLicense(this.requestSucess, this.requestError)
    },

    requestSucess: function (r) {
        console.log("[EVENT] License Server Request Success")
        if (r.statusCode == 0 && r.hasLicense) {
            this.upgradeSuccess()
        }
    },

    requestError: function (r) {
        console.error("[ERROR] License Server Request Error")
    },

    upgradeSuccess: function() {
        var win = this.getView();

        // Save activation
        // localStorage.setItem('activated', true)

        // Remove activation tab
        const upTab = Ext.cq1('app-main').getComponent('upgradeTab') 
        Ext.cq1('app-main').remove(upTab)

        win.close();

        if (win.record)
            Ext.create('Rambox.view.add.Add', { record: win.record });
    },

    onClose: function(btn) {

        if (
            Ext.cq1('app-main').getComponent('upgradeTab') === undefined && 
            !(localStorage.getItem('activated') == 'true')
        ) {
            Ext.cq1('app-main').add(upgrade)
            localStorage.setItem('premiumToggle', true)
        }

        clearInterval(this.requestTimeout)
    }
})
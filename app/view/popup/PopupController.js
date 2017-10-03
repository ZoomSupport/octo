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

    doUpgrade: function (btn) {

        // this.upgradeSuccess();

        ipc.send("openExternalLink", 'https://zeoalliance.com')

        // Enable Spinner view
        this.getView().getComponent('buy-popup').setHidden(true)
        this.getView().getComponent('buy-spinner').setHidden(false)

        this.requestTimeout = setTimeout(this.requestLoop.bind(this), this.timeoutTime)

        console.log("TIME TO UPGRADE");
    },

    requestLoop: function () {
        console.log("LOOPING REQUEST")

        Rambox.util.License.checkLicense(function (r) {

            if (r.statusCode == 0 && r.hasLicense) {
                this.upgradeSuccess()
            } else {
                this.requestTimeout = setTimeout(this.requestLoop.bind(this), this.timeoutTime)
            }
        }.bind(this), function (r) {
            this.requestTimeout = setTimeout(this.requestLoop.bind(this), this.timeoutTime)
        }.bind(this))
    },

    upgradeSuccess: function() {
        var win = this.getView();

        // Save activation
        localStorage.setItem('activated', true)

        // Remove activation pin
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
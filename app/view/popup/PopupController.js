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
    // externalURL: 'https://zeoalliance.com',

    afterRenderMain: function () {
        var win = this.getView();
        
        if (win.oldTab)
            Ext.cq1('app-main').setActiveTab(win.oldTab)
    },

    doUpgrade: function (url) {
        ga_storage._trackEvent('Application', 'Upgrade to PRO Click')
        FB.AppEvents.logEvent('Upgrade to PRO Click');

        ipc.send("openExternalLink", this.patchParams(url))

        // Enable Spinner view
        this.getView().getComponent('buy-popup').setHidden(true)
        this.getView().getComponent('buy-spinner').setHidden(false)

        this.requestTimeout = setInterval(this.requestLoop.bind(this), this.timeoutTime)
    },

    patchParams: function(url) {
        var u = url.repeat(1) + "?"

        const info = ipc.sendSync('getSysInfo') 
        const prm = {
            "x-macaddress": info.macAddress,
            "x-serial": info.serial,
            "x-prepay": "bn_octo_def",
            "x-affid": localStorage.getItem('affid'),
        }

        for (var k in prm) {
            u += `${k}=${encodeURIComponent(prm[k])}&`
        }

        return u
    },

    cancelActivation: function () {

        this.getView().getComponent('buy-popup').setHidden(false)
        this.getView().getComponent('buy-spinner').setHidden(true)

        clearInterval(this.requestTimeout)
    },

    displayManualActivation: function () {

        this.getView().getComponent('buy-popup').hide()
        this.getView().getComponent('manual-activation').show()
    },

    activateClick: function (c) {
        var me = this

        var textField = Ext.getCmp('actv-code')
        var errField = Ext.getCmp('err-field')
        var code = textField.getValue()

        // Disable textfield and activation button
        textField.getTrigger('invalid').hide()
        textField.getTrigger('wait').show()
        c.disable()
        textField.disable()

        // Validate License
        Rambox.util.License.activateByKey(code, 
        // Handle Success
        function () {
            localStorage.setItem('activated', true)
            me.upgradeSuccess("manual-activation")
        },

        // Handle Error
        function (code, msg) {
            textField.getTrigger('wait').hide()
            textField.getTrigger('invalid').show()

            c.enable()
            textField.enable()

            textField.focus()

            errField.setHtml("<h2 class='popup-text popup-spinner-subtitle title-err' style='margin-top: 0'>"+msg+"</h2>")
        })

        console.log(textField)
    },

    onCodeEnter: function( field, e ) {
		var me = this;

		if ( e.getKey() == e.ENTER ) { 
            this.activateClick(Ext.getCmp('actv-btn'))
		}
	},

    requestLoop: function () {
        console.log("LOOPING REQUEST")

        console.log(this.requestSucess)

        Rambox.util.License.checkLicense(this.requestSucess.bind(this), this.requestError)
    },

    requestSucess: function (r) {
        console.log("[EVENT] License Server Request Success", r)
        if (r.statusCode == 0 && r.hasLicense) {
            this.upgradeSuccess("buy-spinner")
        }
    },

    requestError: function (r) {
        console.error("[ERROR] License Server Request Error")
    },

    upgradeSuccess: function(curViewId) {

        // Save activation
        // localStorage.setItem('activated', true)
        ga_storage._trackEvent('Application', 'Upgrade to PRO Successful')
        FB.AppEvents.logEvent('Upgrade to PRO Successful');

        // Remove activation tab
        const upTab = Ext.cq1('app-main').getComponent('upgradeTab') 
        Ext.cq1('app-main').remove(upTab)

        // Display Finnished Dialog
        this.getView().getComponent(curViewId).hide()
        this.getView().getComponent("activation-success").show()
    },

    activateFinnish: function () {
        var win = this.getView();

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
    },

    renderBackButton: function (c) {
        var me = this;

        c.getEl().on({
            click: function() {
                me.cancelActivation()
            }
        })
    }

    ,afterRenderWebview: function (c) {
        var me = this
        var webview = c.getEl().el.dom

        // Intersect new window event
        webview.addEventListener('new-window', function (e) {
            let url = e.url
            let param = url.split('#')[1].split('=')

            console.log(param)

            switch (param[0]) {
                case 'buy':
                    console.log(this)
                    me.doUpgrade(param[1])
                break;

                case 'manual':
                    console.log('ACTIVATE MANUALLY ')
                    me.displayManualActivation()
                break;
            }
        })
    }
})
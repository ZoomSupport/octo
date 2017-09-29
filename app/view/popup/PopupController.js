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


    doUpgrade: function (btn) {

        this.upgradeSuccess();

        console.log("TIME TO UPGRADE");
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
        
        if (Ext.cq1('app-main').getComponent('upgradeTab') === undefined && !localStorage.getItem('activated')) {
            Ext.cq1('app-main').add(upgrade)
            localStorage.setItem('premiumToggle', true)
        }
    }
})
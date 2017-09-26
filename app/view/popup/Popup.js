Ext.define('Rambox.view.popup.Popup', {
     extend: 'Ext.window.Window'

    ,requires: [
         'Rambox.view.popup.PopupController'
        ,'Rambox.view.popup.PopupModel'
    ]

    ,controller: 'popup-popup'
    ,viewModel: {
        type: 'popup-popup'
    }

    // defaults
	,modal: true
	,width: 500
	,autoShow: true
	,resizable: false
	,draggable: false
    ,bodyPadding: 20

    ,initComponent: function() {

        this.title = "Upgrade To Premium";
        this.items = {
        }

        this.callParent(this)
    }
})
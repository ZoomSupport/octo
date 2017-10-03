Ext.define('Rambox.view.popup.Popup', {
     extend: 'Ext.window.Window'

    ,requires: [
         'Rambox.view.popup.PopupController'
        ,'Rambox.view.popup.PopupModel'
        ,'Rambox.util.License'
    ]

    ,controller: 'popup-popup'
    ,viewModel: {
        type: 'popup-popup'
    }

    // defaults
	,modal: true
    ,width: 500
    ,height: 500
	,autoShow: true
	,resizable: false
    ,draggable: false
    
    ,cls: "upgrade-popup"
    // ,bodyPadding: 20

    ,initComponent: function() {

        console.log(this.record)

        // this.title = "Upgrade To Premium";
        this.items = [
            {
                xtype: "container",
                layout: {
                    type: "vbox",
                    align: "center",
                    pack: "center"
                },

                itemId: "buy-popup",
                hidden: false,

                items: [
                    {
                        xtype: "image",
                        src: "resources/popup/premium.png",
                        width: 500,
                        height: 400,
                    },

                    // {
                    //     type: "component",
                    //     html: "<img src='resources/popup/premium.png' width=500>",
                    // },

                    // {
                    //     xtype: "button",
                    //     text: 'Upgrade to Premium $14.95',
                    //     handler: "doUpgrade"
                    // }
                ]
            },

            {
                xtype: "container",
                layout: {
                    type: "vbox",
                    align: "center",
                    pack: "center",
                },

                itemId: "buy-spinner",
                hidden: true,

                items: [
                    {
                        type: "component",
                        html: "<img class='popup-spinner' src='resources/tools/Spinner.svg' />",
                        margin: "50 0 0 0"
                    },

                    {
                        type: "component",
                        html: "<h3 class='popup-spinner-text'>Waiting for license activation</h3>"
                    }
                ]
            }
        ]

        this.buttons = [
            ,{
                 text: "Upgrade"
                ,itemId: "submit"
                ,handler: "doUpgrade"
            }
        ]

        this.callParent(this)
    }

    ,listeners: {
        close: 'onClose'
    }
})
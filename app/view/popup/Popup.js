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
                    // {
                    //     xtype: "image",
                    //     src: "resources/popup/premium.png",
                    //     width: 500,
                    //     height: 400,
                    // },

                    // {
                    //     xtype: "button",
                    //     text: 'Upgrade to Premium $14.95',
                    //     handler: "doUpgrade"
                    // }

                    {
                         xtype: 'component'
                        ,hideMode: 'offsets'
                        ,autoRender: true
                        ,autoShow: true
                        ,autoEl: {
                             tag: 'webview'
                            ,src: popupConfig.url
                            ,style: 'width:498px; height:462px; visibility:visible;'
                            // ,plugins: 'true'
                            // ,allowtransparency: 'on'
                            ,autosize: 'on'
                        }

                        ,listeners: {
                            afterrender: "afterRenderWebview",
                        }
                   }
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

                padding: "30 0 0 0",

                items: [
                    {
                        type: "component",
                        html: "<h2 class='popup-text popup-spinner-title'>WAITING FOR ACTIVATION...</h2>",
                    },

                    {
                        type: "component",
                        html: "<img class='popup-spinner' src='resources/tools/Spinner.svg' />",
                        margin: "50 0 50 0"
                    },

                    {
                        type: "component",
                        html: "<a href='#' class='popup-text popup-spinner-cancel'>Cancel and activate manually</a>",

                        listeners: {
                            render: function (c) {
                                c.getEl().on({
                                    click: function() {
                                        console.log('LINK CLICK')
                                    }
                                })
                            }
                        }
                    }
                ]
            },

            // {
            //     xtype: "container",
            //     layout: {
            //         type: "vbox",
            //         align: "center",
            //         pack: "center",
            //     },

            //     itemId: "buy-spinner",
            //     hidden: true,

            //     padding: "30 0 0 0",

            //     items: [
            //         {
            //             type: "component",
            //             html: "<h2 class='popup-text popup-spinner-title'>WAITING FOR ACTIVATION...</h2>"
            //         },

            //         {
            //             type: "component",
            //             html: "<img class='popup-spinner' src='resources/tools/Spinner.svg' />",
            //             margin: "50 0 50 0"
            //         },

            //         {
            //             type: "component",
            //             html: "<a href='#' class='popup-text popup-spinner-cancel'>Cancel and activate manually</a>"
            //         }
            //     ]
            // }
        ]

        // this.buttons = [
        //     ,{
        //          text: "Upgrade"
        //         ,itemId: "submit"
        //         ,handler: "doUpgrade"
        //     }
        // ]

        this.callParent(this)
    }

    ,listeners: {
        close: 'onClose'
    }
})
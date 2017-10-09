Ext.define('Rambox.view.popup.Popup', {
     extend: 'Ext.window.Window'

    ,requires: [
         'Rambox.view.popup.PopupController'
        ,'Rambox.view.popup.PopupModel'
        ,'Rambox.util.License'
    ]

    ,controller: 'popup-popup'
    // ,viewModel: {
    //     type: 'popup-popup'
    // }

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
                // hidden: false,
                hidden: true,

                items: [

                    {
                         xtype: 'component'
                        ,hideMode: 'offsets'
                        ,autoRender: true
                        ,autoShow: true
                        ,autoEl: {
                             tag: 'webview'
                            ,src: popupConfig.url
                            ,style: 'width:498px; height:462px; visibility:visible;'
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
                            render: "renderBackButton"
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
                hidden: false,

                padding: "30 0 0 0",

                items: [
                    {
                        type: "component",
                        html: "<h2 class='popup-text popup-spinner-title'>COMPLETE YOUR ACTIVATION</h2>",

                        margin: "40 0"
                    },

                    {
                        type: "component",
                        html: "<h2 class='popup-text popup-spinner-subtitle'>Please enter your Activation Code below:</h2>",
                    },

                    {
                        xtype: "textfield",
                        cls: "code-field",
                        grow: true,

                        growMin: 340,
                        growMax: 340,

                        triggers: {
                            wait: {
                                weight: 1,
                                cls: 'loading-spinner',

                                hidden: true
                            },

                            valid: {
                                cls: 'act-valid',
                                hidden: true,
                            },

                            invalid: {
                                cls: 'act-invalid',
                                hidden: false,
                            }
                       }
                    },

                    {
                        type: "component",
                        // html: "<h2 class='popup-text popup-spinner-subtitle' style='margin-top: 0'>Verifying activation code</h2>",
                        html: "<h2 class='popup-text popup-spinner-subtitle' style='margin-top: 0'></h2>",
                    },

                    {
                        xtype: "button",
                        cls: "activate-button",
                        text: "Activate",

                        margin: "35 0",
                        padding: "18 65"
                    }
                ]
            },

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
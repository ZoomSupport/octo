Ext.define('Rambox.view.main.About', {
	 extend: 'Ext.window.Window'
	,xtype: 'about'
	,title: 'About Octo' //locale['app.about[0]']
	,cls: 'about-window'
	,autoShow: true
	,modal: true
	,resizable: false
	,constrain: true
	,width: 352
	,height: 420
	,bodyPadding: "10 25"
	,data: {
		 version: require('electron').remote.app.getVersion()
		,platform: process.platform
		,arch: process.arch
		,electron: process.versions.electron
		,chromium: process.versions.chrome
		,node: process.versions.node
	}
	,tpl: [
		 '<div style="text-align:center;"><img src="resources/Icon.png" width="100" /></div>'
		,'<h4 style="text-align:center;">Octo {version}</h4>'
		,'<h3 class="about-desc">Keep all messaging services in one window and create your own set of messengers with Octo.</h3>'
		,'<div> <a href="mailto:octo.support@bestmacsoft.com" target="_blank">octo.support@bestmacsoft.com</a> </div>'
	],

	dockedItems:{
		xtype: 'toolbar',
		flex: 1,

		dock: 'bottom',
		ui: 'footer',

		padding: "14 25",


		layout: {
			type: 'vbox',
			align: 'left',
		},

		items: [
			{
				xtype: "container",
				layout: {
					type: 'hbox',
					align: 'left',
				},

				margin: "0 0 5 0",

				items: [
					{
						xtype: "component",
						html: '<a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">Licensed under GNU GPL v.3</a>',

						margin: "2 45 0 0"
					},

					{
						xtype: "component",
						html: '<img src="resources/tools/github_logo.png" width="80" height="23" />',
					}
				]

			},

			{
				xtype: "component",
				width: 280,
				html: '<span class="disclamer">Octo is not affiliated with any of the messaging apps offered. All product names, logos, trademarks, and brands are property of their respective owners.</span>'
			}
		]
	} 
});

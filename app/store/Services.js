
const upgrade = {
	icon: 'resources/tools/upgrade.png',

	title: 'Upgrade',

	id: 'upgradeTab',
	closable: false,
	reorderable: false,

	tabConfig: {
		cls: 'b-icon',
		handler: 'notButton',
	},
}

const notifications = {
	icon: 'resources/tools/notifications.png',

	title: 'Notifications On',
	
	id: 'notificationsTab',
	closable: false,
	reorderable: false,

	tabConfig: {
		// cls: 'b-icon n-opacity',
		id: 'notTab',
		cls: 'b-icon',
		handler: 'notButton'
	},
}


const settings = {
	icon: (localStorage.getItem('appealingSettings') == 'true' || localStorage.getItem('appealingSettings') == null) ? 'resources/tools/settings_2.png' : 'resources/tools/settings.png'
	
	,id: 'settingsTab'

	,title: 'Settings'

	,itemId: 'setTab'
	,cls: 'settings-panel'
	,closable: false
	,reorderable: false 
	,layout: 'hbox'
	
	,hidden: false 

	,tabConfig: {
		cls: 'b-icon',
	}

	,items: [
		{
			 xtype: 'grid'
			,title: '<h1 class="sel-main-title">Settings</h1> <h3 class="sel-sub-title">Preferences for your services</h3>'
			,store: 'Services'
			// ,hideHeaders: true
			,margin: '0'
			,flex: 1

			// ,header: { height: 50 }
			,header: { padding: "30 30" }
			// ,headerBorders: false 
			// ,height: 100

			,tools: [
				
				{
					xtype: 'container',
					layout: {
						type: 'vbox'
					},

					cls: "social-container",

					items: [
						{
							type: "component",
							html: '<h3 class="sel-sub-title" style="margin-left: 30px; margin-top: 0">Share app:</h3>',
						},

						{
							xtype: 'container',
							layout: {
								type: 'hbox'
							},

							cls: "social-icon-container",

							items: [
								{
									type: "component",
									html: '<a target="_blank" href="https://zeoalliance.com/"><img class="social-icon" src="resources/tools/facebook.png"></a>',
								},
								{
									type: "component",
									html: '<a target="_blank" href="https://zeoalliance.com/"><img class="social-icon" src="resources/tools/twitter.png"></a>',
								},
								{
									type: "component",
									html: '<a target="_blank" href="https://zeoalliance.com/"><img class="social-icon" src="resources/tools/google.png"></a>',
								},
							]
						}
					]
				}
			
			]
			,columns: [
				{
					 xtype: 'templatecolumn'

					,header: 'YOUR SERVICES'

					// ,width: 400
					,flex: 1
					,height: 50
					,variableRowHeight: true
					,tpl: [
						'<img class="settings-row-icon" src="{[ values.type !== \"custom\" ? \"resources/icons/\"+values.logo : (values.logo == \"\" ? \"resources/icons/custom.png\" : values.logo) ]}" data-qtip="{type:capitalize}" width="42" />',
						'<span class="settings-row-title">{name}</span>'
					]

					,cls: "column-icon"

					,menuDisabled: true
					,sortable: false
					,hidable: false
					,draggable: false
					,resizable: false
				}
				
				,{
					xtype: 'checkcolumn',
					header: 'NOTIFICATIONS',
					width: 150,
					dataIndex: 'notifications',

					menuDisabled: true,
					sortable: false
					,hidable: false
					,draggable: false
					,resizable: false
				},
				{
					xtype: 'checkcolumn',
					header: 'SOUND',
					width: 100,
					dataIndex: 'muted',

					menuDisabled: true,
					sortable: false
					,hidable: false
					,draggable: false
					,resizable: false
				}
				,{
					 xtype: 'actioncolumn'
					,header: 'REMOVE'
					,width: 110
					,align: 'center'

					,menuDisabled: true
					,sortable: false
					,hidable: false
					,draggable: false
					,resizable: false

					,items: [
						{
							// glyph: 0xf1f8
							icon: 'resources/tools/delete.png',
							iconCls: 'settings-delete-icon'
							// ,tooltip: locale['app.main[14]']
							,handler: 'removeService'
							// ,getClass: function(){ return 'x-hidden-display'; }
						}
					]
				}
				// ,{
				// 	 xtype: 'checkcolumn'
				// 	,width: 40
				// 	,dataIndex: 'enabled'
				// 	,renderer: function(value, metaData) {
				// 		metaData.tdAttr = 'data-qtip="Service '+(value ? 'Enabled' : 'Disabled')+'"';
				// 		return this.defaultRenderer(value, metaData);
				// 	}
				// 	,listeners: {
				// 		checkchange: 'onEnableDisableService'
				// 	}
				// }
			]
			,viewConfig: {
				 emptyText: locale['app.main[15]']
				,forceFit: true
				,stripeRows: false 
				// ,height: 100
				// ,itemHeight: 100
			}
			,listeners: {
				 edit: 'onRenameService'
				,rowdblclick: 'showServiceTab'
			}
		}
	]
}

Ext.define('Rambox.store.Services', {
	 extend: 'Ext.data.Store'
	,alias: 'store.services'

	,requires: [
		'Ext.data.proxy.LocalStorage'
	]

	,model: 'Rambox.model.Service'

	,autoLoad: true
	,autoSync: true

	,groupField: 'align'
	,sorters: [
		{
			 property: 'position'
			,direction: 'ASC'
		}
	]

	,listeners: {
		load: function( store, records, successful ) {
			Ext.cq1('app-main').suspendEvent('add');


			var servicesLeft = [];
			var servicesRight = [];
			store.each(function(service) {
				// Fix some services with bad IDs
				// TODO: Remove in next release
				switch ( service.get('type') ) {
					case 'office365':
						service.set('type', 'outlook365');
						break;
					case ' irccloud':
						service.set('type', 'irccloud');
						break;
					default:
						break;
				}

				// If the service is disabled, we dont add it to tab bar
				if ( !service.get('enabled') ) return;

				var cfg = {
					 xtype: 'webview'
					,id: 'tab_'+service.get('id')
					,title: service.get('name')
					,icon: service.get('type') !== 'custom' ? 'resources/icons/'+service.get('logo') : ( service.get('logo') === '' ? 'resources/icons/custom.png' : service.get('logo'))
					,src: service.get('url')
					,type: service.get('type')
					,muted: service.get('muted')
					,includeInGlobalUnreadCounter: service.get('includeInGlobalUnreadCounter')
					,displayTabUnreadCounter: service.get('displayTabUnreadCounter')
					,enabled: service.get('enabled')
					,record: service
					,tabConfig: {
						service: service,
					}
				};

				service.get('align') === 'left' ? servicesLeft.push(cfg) : servicesRight.push(cfg);
			});

			if ( !Ext.isEmpty(servicesLeft) ) Ext.cq1('app-main').insert(0, servicesLeft);
			if ( !Ext.isEmpty(servicesRight) ) Ext.cq1('app-main').add(servicesRight);

			if (store.data.length > 1) {
				if (!localStorage.getItem('activated') && localStorage.getItem('premiumToggle')) Ext.cq1('app-main').add(upgrade)

				Ext.cq1('app-main').add(notifications)
				Ext.cq1('app-main').add(settings)
			}

			const welcomeTab = Ext.cq1('app-main').getComponent('welcomeTab');

			if (store.data.length === 0) {
				Ext.cq1('app-main').setActiveTab(welcomeTab)
			}

			store.suspendEvent('load');
			Ext.cq1('app-main').resumeEvent('add');
		},

		add: function (store, records, i) {

			if (store.data.length > 1) {
				console.log(Ext.cq1('app-main').getComponent('upgradeTab'));

				// if (Ext.cq1('app-main').getComponent('upgradeTab') === undefined)
				// 	Ext.cq1('app-main').add(upgrade)

					
				if (typeof Ext.cq1('app-main').getComponent('notificationsTab') == 'undefined')
					Ext.cq1('app-main').add(notifications)

				if (typeof Ext.cq1('app-main').getComponent('setTab') == 'undefined')
					Ext.cq1('app-main').add(settings)
			}

			if (store.data.length == 1) {
				localStorage.setItem('appealingPlus', true)

				// Update within tab
				const tab = Ext.cq1('app-main').getComponent('plusTab') 
				tab.setIcon('resources/tools/add_2.png')
			} else if (store.data.length > 1) {
				localStorage.setItem('appealingPlus', false)

				const tab = Ext.cq1('app-main').getComponent('plusTab') 
				tab.setIcon('resources/tools/add.png')
			}

		}
	}
});

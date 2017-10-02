
const upgrade = {
	icon: 'resources/tools/upgrade.png',

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
	icon: 'resources/tools/settings.png'
	
	,id: 'settingsTab'
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
					xtype: 'container'
				   ,margin: '0'
				   ,tpl: [
					   '<h3 class="sel-sub-title">Share app:</h3>'
				   ]
				}
			]
			,columns: [
				{
					 xtype: 'templatecolumn'
					,width: 50
					,height: 50
					,variableRowHeight: true
					,tpl: '<img src="{[ values.type !== \"custom\" ? \"resources/icons/\"+values.logo : (values.logo == \"\" ? \"resources/icons/custom.png\" : values.logo) ]}" data-qtip="{type:capitalize}" width="32" style="{[ values.enabled ? \"-webkit-filter: grayscale(0)\" : \"-webkit-filter: grayscale(1)\" ]}" />'

					,menuDisabled: true
					,sortable: false
					,hidable: false
					,draggable: false
					,resizable: false
				}
				,{
					 dataIndex: 'name'
					,header: 'YOUR SERVICES'
					,variableRowHeight: true

					,menuDisabled: true
					,sortable: false
					,hidable: false
					,draggable: false
					,resizable: false

					,flex: 1
					,editor: {
						 xtype: 'textfield'
						,allowBlank: true
					}
				}
				// ,{
				// 	xtype: 'actioncolumn'
				// 	,width: 60
				// 	,align: 'right'
				// 	,items: [
				// 		{
				// 				glyph: 0xf1f7
				// 			,tooltip: locale['app.main[11]']
				// 			,getClass: function( value, metaData, record, rowIndex, colIndex, store, view ){
				// 				if ( record.get('notifications') ) return 'x-hidden';
				// 			}
				// 		}
				// 		,{
				// 				glyph: 0xf026
				// 			,tooltip: locale['app.main[12]']
				// 			,getClass: function( value, metaData, record, rowIndex, colIndex, store, view ){
				// 				if ( !record.get('muted') ) return 'x-hidden';
				// 			}
				// 		}
				// 	]
				// }
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
					,width: 100
					,align: 'center'

					,menuDisabled: true
					,sortable: false
					,hidable: false
					,draggable: false
					,resizable: false

					,items: [
						{
							glyph: 0xf1f8
							,tooltip: locale['app.main[14]']
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

				if (Ext.cq1('app-main').getComponent('notificationsTab') === undefined)
					Ext.cq1('app-main').add(notifications)

				if (Ext.cq1('app-main').getComponent('settingsTab') === undefined)
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

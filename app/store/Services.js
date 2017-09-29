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
						service: service
					}
				};

				service.get('align') === 'left' ? servicesLeft.push(cfg) : servicesRight.push(cfg);
			});

			if ( !Ext.isEmpty(servicesLeft) ) Ext.cq1('app-main').insert(1, servicesLeft);
			if ( !Ext.isEmpty(servicesRight) ) Ext.cq1('app-main').add(servicesRight);
			
			Ext.cq1('app-main').add({
				icon: 'resources/tools/upgrade.png',
				id: 'upgradeTab',
				cls: 'settings-panel',
				closable: false,
				reorderable: false,
				layout: 'hbox',

				tabConfig: {
					cls: 'b-icon',
					handler: 'notButton',
				},
			})
			
			Ext.cq1('app-main').add({
				icon: 'resources/tools/notifications.png',
				
				id: 'notificationsTab',
				cls: 'settings-panel',
				closable: false,
				reorderable: false,
				layout: 'hbox',

				tabConfig: {
					cls: 'b-icon n-opacity',
					handler: 'notButton'
				},
			})

			Ext.cq1('app-main').add({
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
						,title: locale['app.main[4]']
						,store: 'Services'
						,hideHeaders: true
						,margin: '0 0 0 5'
						,flex: 1
	
						,header: { height: 50 }
	
						,tools: [
							{
									xtype: 'button'
								,glyph: 'xf1f8@FontAwesome'
								,baseCls: ''
								,tooltip: locale['app.main[10]']
								,handler: 'removeAllServices'
							}
						]
						,columns: [
							{
									xtype: 'templatecolumn'
								,width: 50
								,variableRowHeight: true
								,tpl: '<img src="{[ values.type !== \"custom\" ? \"resources/icons/\"+values.logo : (values.logo == \"\" ? \"resources/icons/custom.png\" : values.logo) ]}" data-qtip="{type:capitalize}" width="32" style="{[ values.enabled ? \"-webkit-filter: grayscale(0)\" : \"-webkit-filter: grayscale(1)\" ]}" />'
							}
							,{
									dataIndex: 'name'
								,variableRowHeight: true
								,flex: 1
								,editor: {
										xtype: 'textfield'
									,allowBlank: true
								}
							}
							,{
									xtype: 'actioncolumn'
								,width: 60
								,align: 'right'
								,items: [
									{
											glyph: 0xf1f7
										,tooltip: locale['app.main[11]']
										,getClass: function( value, metaData, record, rowIndex, colIndex, store, view ){
											if ( record.get('notifications') ) return 'x-hidden';
										}
									}
									,{
											glyph: 0xf026
										,tooltip: locale['app.main[12]']
										,getClass: function( value, metaData, record, rowIndex, colIndex, store, view ){
											if ( !record.get('muted') ) return 'x-hidden';
										}
									}
								]
							}
							,{
								xtype: 'checkcolumn',
								width: 40,
								dataIndex: 'notifications',
							},
							{
								xtype: 'checkcolumn',
								width: 40,
								dataIndex: 'muted'
							}
							,{
								xtype: 'actioncolumn'
								,width: 40
								,align: 'center'
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
							,stripeRows: true
						}
						,listeners: {
								edit: 'onRenameService'
							,rowdblclick: 'showServiceTab'
						}
					}
				]
			})

			const welcomeTab = Ext.cq1('app-main').getComponent('welcomeTab');

			if (store.data.length === 0) {
				Ext.cq1('app-main').setActiveTab(welcomeTab)
			}

			store.suspendEvent('load');
			Ext.cq1('app-main').resumeEvent('add');
		},

		add: function (store, records, i) {
			console.log('Adding service');
			Ext.cq1('app-main').suspendEvent('add');
		}
	}
});

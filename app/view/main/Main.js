Ext.define('Rambox.view.main.Main', {
	 extend: 'Ext.tab.Panel'
	,requires: [
		 'Rambox.view.main.MainController'
		,'Rambox.view.main.MainModel'
		,'Rambox.ux.WebView'
		,'Rambox.ux.mixin.Badge'
		,'Rambox.view.add.Add'
		,'Rambox.view.popup.Popup'
		,'Ext.ux.TabReorderer',

	]

	,xtype: 'app-main'

    ,tabPosition: 'left'
	,tabRotation: 0

	// ,stores: [
	//    'Services'
	// ]
	
	// ,padding: 0
	// ,border: 0

	,controller: 'main'
	,viewModel: {
		type: 'main'
	}

	,plugins: [
		{
			 ptype: 'tabreorderer'
		}
	]

	// ,add: function () {
	// 	// console.log('TAB INIT NOW', this);
	// 	// Rambox.view.main.Main.add.call(this)

	// 	const serviceCnt = Ext.getStore('Services').data // Current service number
	// 	console.log(serviceCnt)
	// }

	,autoRender: true
	,autoShow: true
	,deferredRender: false
	,items: [
		
		{
			 icon: 'resources/tools/add.png'
			,title: 'Add Service'
			,id: 'ramboxTab'
			,cls: 'main-panel'
			,closable: false
			,reorderable: false 
			,autoScroll: true
			,layout: 'hbox'
			,tabConfig: {} // Created empty for Keyboard Shortcuts
			,dock: 'bottom'
			,items: [
				{
					 xtype: 'panel'
					,title: '<h1 class="sel-main-title">SERVICES</h1> <h3 class="sel-sub-title">Select a service you need</h3>' //locale['app.main[0]']
					,margin: '0 20'
					,flex: 1
					,header: { padding: "20 0" }
					,tools: [
						{
							 xtype: 'checkboxgroup'
							,items: [
								{
									 xtype: 'checkbox'
									,boxLabel: locale['app.main[1]'] // Messaging
									,name: 'messaging'
									,checked: true
									,uncheckedValue: false
									,inputValue: true
									,hidden: true
								}
								,{
									 xtype: 'checkbox'
									,boxLabel: locale['app.main[2]'] // Email
									,margin: '0 10 0 10'
									,name: 'email'
									,checked: true
									,uncheckedValue: false
									,inputValue: true
									,hidden: true
								}
							]
							,listeners: {
								change: 'doTypeFilter'
							}
						},
						{
							 xtype: 'textfield'
							,grow: true
							,cls: "header-search"
							,growMin: 250
							,growMax: 250
							,emptyText: "Search"
							,triggers: {
								 clear: {
									 weight: 0
									,cls: Ext.baseCSSPrefix + 'form-clear-trigger'
									,hidden: true
									,handler: 'onClearClick'
								}
								,search: {
									 weight: 1
									,cls: Ext.baseCSSPrefix + 'form-search-trigger search-trigger'
								}
							}
							,listeners: {
								 change: 'onSearchServiceChange'
								,afterrender: 'onSearchRender'
								,specialkey: 'onSearchEnter'
							}
						}
					]
					// Renders messages 
					,items: [
						{
							 xtype: 'dataview'
							,store: 'ServicesList'
							,itemSelector: 'div.service'
							,tpl: [
								'<h3 class="main-type-title">MESSAGING APPS</h3>'
								,'<tpl for=".">'
								 	,'<tpl if="type == \'messaging\'">'
										,'<div class="service" id="s_{id}" >'
											,'<img src="resources/icons/{logo}" width="48" /><br />'
											,'<h3 class="title">{name}</h3>'
										,'</div>'
									,'</tpl>'
								,'</tpl>'

								,'<h3 class="main-type-title">EMAIL</h3>'
								,'<tpl for=".">'
								 	,'<tpl if="type == \'email\'">'
										,'<div class="service" id="s_{id}" >'
											,'<img src="resources/icons/{logo}" width="48" /><br />'
											,'<h3 class="title">{name}</h3>'
										,'</div>'
									,'</tpl>'
								,'</tpl>'
							]
							,emptyText: '<div style="padding: 20px;">'+locale['app.main[3]']+'</div>'
							,listeners: {
								itemclick: 'onNewServiceSelect'
							}
						}
					]
					
				}
				
			]
			// ,tbar: {
			// 	 xtype: 'toolbar'
			// 	,height: 42
			// 	,ui: 'main'
			// 	,enableOverflow: true
			// 	,overflowHandler: 'menu'
			// 	,items: [
			// 		{
			// 			 glyph: 'xf1f7@FontAwesome'
			// 			,text: locale['app.main[16]']+': '+(JSON.parse(localStorage.getItem('dontDisturb')) ? locale['app.window[20]'] : locale['app.window[21]'])
			// 			,tooltip: locale['app.main[17]']+'<br/><b>'+locale['app.main[18]']+': F1</b>'
			// 			,enableToggle: true
			// 			,handler: 'dontDisturb'
			// 			,reference: 'disturbBtn'
			// 			,id: 'disturbBtn'
			// 			,pressed: JSON.parse(localStorage.getItem('dontDisturb'))
			// 		}
			// 		,{
			// 			 glyph: 'xf023@FontAwesome'
			// 			,text: locale['app.main[19]']
			// 			,tooltip: locale['app.main[20]']+'<br/><b>'+locale['app.main[18]']+': F2</b>'
			// 			,handler: 'lockRambox'
			// 			,id: 'lockRamboxBtn'
			// 		}
			// 		,'->'
			// 		,{
			// 			 xtype: 'image'
			// 			,id: 'avatar'
			// 			,bind: {
			// 				 src: '{avatar}'
			// 				,hidden: '{!avatar}'
			// 			}
			// 			,width: 30
			// 			,height: 30
			// 			,style: 'border-radius: 50%;border:2px solid #d8d8d8;'
			// 		}
			// 		,{
			// 			 id: 'usernameBtn'
			// 			,bind: {
			// 				 text: '{username}'
			// 				,hidden: '{!username}'
			// 			}
			// 			,menu: [
			// 				{
			// 					 text: 'Synchronize Configuration'
			// 					,glyph: 'xf0c2@FontAwesome'
			// 					,menu: [
			// 						{
			// 							 xtype: 'label'
			// 							,bind: {
			// 								html: '<b class="menu-title">Last Sync: {last_sync}</b>'
			// 							}
			// 						}
			// 						,{
			// 							 text: 'Backup'
			// 							,glyph: 'xf0ee@FontAwesome'
			// 							,scope: Rambox.ux.Auth0
			// 							,handler: Rambox.ux.Auth0.backupConfiguration
			// 						}
			// 						,{
			// 							 text: 'Restore'
			// 							,glyph: 'xf0ed@FontAwesome'
			// 							,scope: Rambox.ux.Auth0
			// 							,handler: Rambox.ux.Auth0.restoreConfiguration
			// 						}
			// 						,{
			// 							 text: 'Check for updated backup'
			// 							,glyph: 'xf021@FontAwesome'
			// 							,scope: Rambox.ux.Auth0
			// 							,handler: Rambox.ux.Auth0.checkConfiguration
			// 						}
			// 					]
			// 				}
			// 				,'-'
			// 				,{
			// 					 text: locale['app.main[21]']
			// 					,glyph: 'xf08b@FontAwesome'
			// 					,handler: 'logout'
			// 				}
			// 			]
			// 		}
			// 		,{
			// 			 text: locale['app.main[22]']
			// 			,icon: 'resources/auth0.png'
			// 			,id: 'loginBtn'
			// 			,tooltip: locale['app.main[23]']+'<br /><br /><i>'+locale['app.main[24]']+' Auth0 (http://auth0.com)</i>'
			// 			,bind: {
			// 				hidden: '{username}'
			// 			}
			// 			,handler: 'login'
			// 		}
			// 		,{
			// 			 tooltip: locale['preferences[0]']
			// 			,glyph: 'xf013@FontAwesome'
			// 			,handler: 'openPreferences'
			// 		}
			// 	]
			// }
			// ,bbar: [
			// 	{
			// 		 xtype: 'segmentedbutton'
			// 		,allowToggle: false
			// 		,items: [
			// 			{
			// 				 text: '<b>Help us</b> with'
			// 				,pressed: true
			// 			}
			// 			,{
			// 				 text: locale['app.main[25]']
			// 				,glyph: 'xf21e@FontAwesome'
			// 				,handler: 'showDonate'
			// 			}
			// 			,{
			// 				 text: 'Translation'
			// 				,glyph: 'xf0ac@FontAwesome'
			// 				,href: 'https://crowdin.com/project/rambox/invite'
			// 			}
			// 		]
			// 	}
			// 	,'->'
			// 	,{
			// 		 xtype: 'label'
			// 		,html: '<span class="fa fa-code" style="color:black;"></span> '+locale['app.main[26]']+' <span class="fa fa-heart" style="color:red;"></span> '+locale['app.main[27]'].replace('Argentina', '<img src="resources/flag.png" alt="Argentina" data-qtip="Argentina" />')
			// 	}
			// 	,'->'
			// 	,{
			// 		xtype: 'segmentedbutton'
			// 		,allowToggle: false
			// 		,items: [
			// 			{
			// 				 text: '<b>Follow us</b>'
			// 				,pressed: true
			// 			}
			// 			,{
			// 				 glyph: 'xf082@FontAwesome'
			// 				,href: 'https://www.facebook.com/ramboxapp'
			// 			}
			// 			,{
			// 				 glyph: 'xf099@FontAwesome'
			// 				,href: 'https://www.twitter.com/ramboxapp'
			// 			}
			// 			,{
			// 				 glyph: 'xf09b@FontAwesome'
			// 				,href: 'https://www.github.com/saenzramiro/rambox'
			// 			}
			// 		]
			// 	}
			// ]
		}

		,{ id: 'tbfill', tabConfig : { xtype : 'tbfill' } }

		// ,{
		// 	icon: 'resources/tools/upgrade.png',

		// 	id: 'upgradeTab',
		// 	cls: 'settings-panel',
		// 	closable: false,
		// 	reorderable: false,
		// 	layout: 'hbox',

		// 	tabConfig: {
		// 		cls: 'b-icon',
		// 		handler: 'notButton',
		// 	},

		// 	items: [],
		// }
		
		// ,{
		// 	icon: 'resources/tools/notifications.png',

		// 	id: 'notificationsTab',
		// 	cls: 'settings-panel',
		// 	closable: false,
		// 	reorderable: false,
		// 	layout: 'hbox',

		// 	hidden: false,

		// 	tabConfig: {
		// 		cls: 'b-icon n-opacity',
		// 		handler: 'notButton'
		// 	},

		// 	items: [],
		// }

		// ,{
		// 	icon: 'resources/tools/settings.png'

		// 	,id: 'settingsTab'
		// 	,cls: 'settings-panel'
		// 	,closable: false
		// 	,reorderable: false 
		// 	,layout: 'hbox'
			
		// 	,hidden: false 

		// 	,tabConfig: {
		// 		cls: 'b-icon',
		// 		// handler: 'testButton',
		// 	}
		// 	,items: [
		// 		{
		// 			 xtype: 'grid'
		// 			,title: locale['app.main[4]']
		// 			,store: 'Services'
		// 			,hideHeaders: true
		// 			,margin: '0 0 0 5'
		// 			,flex: 1

		// 			,header: { height: 50 }

		// 			,tools: [
		// 				{
		// 					 xtype: 'button'
		// 					,glyph: 'xf1f8@FontAwesome'
		// 					,baseCls: ''
		// 					,tooltip: locale['app.main[10]']
		// 					,handler: 'removeAllServices'
		// 				}
		// 			]
		// 			,columns: [
		// 				{
		// 					 xtype: 'templatecolumn'
		// 					,width: 50
		// 					,variableRowHeight: true
		// 					,tpl: '<img src="{[ values.type !== \"custom\" ? \"resources/icons/\"+values.logo : (values.logo == \"\" ? \"resources/icons/custom.png\" : values.logo) ]}" data-qtip="{type:capitalize}" width="32" style="{[ values.enabled ? \"-webkit-filter: grayscale(0)\" : \"-webkit-filter: grayscale(1)\" ]}" />'
		// 				}
		// 				,{
		// 					 dataIndex: 'name'
		// 					,variableRowHeight: true
		// 					,flex: 1
		// 					,editor: {
		// 						 xtype: 'textfield'
		// 						,allowBlank: true
		// 					}
		// 				}
		// 				,{
		// 					 xtype: 'actioncolumn'
		// 					,width: 60
		// 					,align: 'right'
		// 					,items: [
		// 						{
		// 							 glyph: 0xf1f7
		// 							,tooltip: locale['app.main[11]']
		// 							,getClass: function( value, metaData, record, rowIndex, colIndex, store, view ){
		// 								if ( record.get('notifications') ) return 'x-hidden';
		// 							}
		// 						}
		// 						,{
		// 							 glyph: 0xf026
		// 							,tooltip: locale['app.main[12]']
		// 							,getClass: function( value, metaData, record, rowIndex, colIndex, store, view ){
		// 								if ( !record.get('muted') ) return 'x-hidden';
		// 							}
		// 						}
		// 					]
		// 				}
		// 				,{
		// 					xtype: 'checkcolumn',
		// 					width: 40,
		// 					dataIndex: 'notifications',
		// 				},
		// 				{
		// 					xtype: 'checkcolumn',
		// 					width: 40,
		// 					dataIndex: 'muted'
		// 				}
		// 				,{
		// 					xtype: 'actioncolumn'
		// 				   ,width: 40
		// 				   ,align: 'center'
		// 				   ,items: [
		// 					   {
		// 							glyph: 0xf1f8
		// 						   ,tooltip: locale['app.main[14]']
		// 						   ,handler: 'removeService'
		// 						   // ,getClass: function(){ return 'x-hidden-display'; }
		// 					   }
		// 				   ]
		// 			   }
		// 				// ,{
		// 				// 	 xtype: 'checkcolumn'
		// 				// 	,width: 40
		// 				// 	,dataIndex: 'enabled'
		// 				// 	,renderer: function(value, metaData) {
		// 				// 		metaData.tdAttr = 'data-qtip="Service '+(value ? 'Enabled' : 'Disabled')+'"';
		// 				// 		return this.defaultRenderer(value, metaData);
		// 				// 	}
		// 				// 	,listeners: {
		// 				// 		checkchange: 'onEnableDisableService'
		// 				// 	}
		// 				// }
		// 			]
		// 			,viewConfig: {
		// 				 emptyText: locale['app.main[15]']
		// 				,forceFit: true
		// 				,stripeRows: true
		// 			}
		// 			,listeners: {
		// 				 edit: 'onRenameService'
		// 				,rowdblclick: 'showServiceTab'
		// 			}
		// 		}
		// 	]
		// }

		,{
			id: 'welcomeTab'
		   ,cls: 'welcome-panel'
		   ,closable: false
		   ,reorderable: false 
		   ,hidden: true
		   ,layout: 'hbox'

		   ,items: [
			   {
				   xtype: "header",
				   title: "Hello and welcome to octo ^_^ \n This is just a placeholder for future welcome screen"
			   }
		   ]
		}
		
	]

	,listeners: {
		 tabchange: 'onTabChange'
		,add: 'updatePositions'
		,remove: 'updatePositions'
		,childmove: 'updatePositions'
		,beforetabchange: 'setActiveTab'
		// ,added: 'onShow'
	}
});

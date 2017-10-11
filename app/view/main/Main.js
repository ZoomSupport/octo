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

	,controller: 'main'
	,viewModel: {
		type: 'main'
	}

	,plugins: [
		{
			 ptype: 'tabreorderer'
		}
	]

	,tabBar: {
		padding: "25 0 0 0"
	}

	,autoRender: true
	,autoShow: true
	,deferredRender: false

	,items: [
		{
			 icon: (localStorage.getItem('appealingPlus') == 'true') ? 'resources/tools/add_2.png' : 'resources/tools/add.png'
			,title: 'Add Service'
			,id: 'ramboxTab'
			,itemId: 'plusTab'
			,cls: 'main-panel'
			,closable: false
			,reorderable: false 
			,autoScroll: true
			,layout: 'hbox'
			,tabConfig: {
				// cls: 'animated-tab'
			} 
			,dock: 'bottom'
			,items: [
				{
					 xtype: 'panel'
					,itemId: 'main-tab-header'
					// ,title: '<h1 class="sel-main-title">Services</h1> <h3 class="sel-sub-title">Select a service you need</h3>' 
					,title: '<h1 class="sel-main-title">All Services</h1>' 
					// ,margin: '0 20'
					,flex: 1
					,header: { 
						docked: 'top',
						padding: "20 30",
						margin: "0 0 15 0",
					}
					,tools: [
						// {
						// 	 xtype: 'checkboxgroup'
						// 	,items: [
						// 		{
						// 			 xtype: 'checkbox'
						// 			,boxLabel: locale['app.main[1]'] // Messaging
						// 			,name: 'messaging'
						// 			,checked: true
						// 			,uncheckedValue: false
						// 			,inputValue: true
						// 			,hidden: true
						// 		}
						// 		,{
						// 			 xtype: 'checkbox'
						// 			,boxLabel: locale['app.main[2]'] // Email
						// 			,margin: '0 10 0 10'
						// 			,name: 'email'
						// 			,checked: true
						// 			,uncheckedValue: false
						// 			,inputValue: true
						// 			,hidden: true
						// 		}
						// 	]
						// 	,listeners: {
						// 		change: 'doTypeFilter'
						// 	}
						// },
						{
							 xtype: 'textfield'
							,grow: true
							,cls: "header-search"

							,id: "main-search-field"

							,growMin: 350
							,growMax: 350
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
					,items: function () {
						
						var tmp = []
						var objTemplate = {
							 xtype: 'dataview'
							,store: 'ServicesList'

							,itemSelector: 'div.service'

							,tpl: [] 
							,emptyText: '<div style="padding: 20px;">'+locale['app.main[3]']+'</div>'
							,listeners: {
								itemclick: 'onNewServiceSelect'
							}
						}
						const types = [
							{
								name: "TOP MESSAGING APPS",
								id: 'messaging',
								minRank: 10,
							},
							{
								name: "TOP E-MAIL SERVICES",
								id: 'email',
								minRank: 100,
							},
							{
								name: "TOP BUSSINESS TOOLS",
								id: 'tool',
								minRank: 16,
							},
							
							// {
							// 	name: "GAMMING",
							// 	id: 'gaming',
							// 	minRank: 1,
							// },

							{
								name: "OTHER SERVICES",
								id: 'others'
							}
						]

						var inverse = ""

						types.forEach( function (t) {

							let tplTmp = []

							tplTmp.push('<h3 class="main-type-title">'+t.name+'</h3>')
							tplTmp.push('<div class="services">')
							tplTmp.push('<tpl for=".">')


							if (t.id !== 'others') {
	
								tplTmp.push('<tpl if="(type == \''+t.id+'\' && rank &gt; '+t.minRank+')">')
								inverse += '(type == \''+t.id+'\' && rank &lt;= '+t.minRank+') ||'
								
							} else {

								// tplTmp.push('<tpl if="(type == \''+t.id+'\' && rank &gt; '+t.minRank+')">')
								tplTmp.push('<tpl if=" '+inverse+' (type == \'custom\') || (type == \'gaming\') ">')
							}
							// tplTmp.push('<tpl if="(type == \''+t.id+'\' && rank &gt; '+t.minRank+') || type == \'custom\'">')
							// tplTmp.push('<tpl if="(type == \''+t.id+'\' && rank &gt; '+t.minRank+')">')


							tplTmp.push('<div class="service" id="s_{id}">')
							tplTmp.push('<img src="resources/icons/{logo}" width="48" /><br />')
							tplTmp.push('<h3 class="title">{name}</h3>')
							tplTmp.push('</div></tpl></tpl></div>')

							tmp.push(Object.assign({}, objTemplate, {
								tpl: tplTmp,
								// itemId: "msg-container-"+t.id,
							}))

							

						})

						console.log(tmp)
						return tmp
					}()
					
				}
				
			]

		}

		,{ id: 'tbfill', tabConfig : { xtype : 'tbfill' } }

		

		,{
			id: 'welcomeTab'

		   ,cls: 'welcome-panel'

		   ,closable: false
		   ,reorderable: false 
		   ,hidden: true

		   ,layout: {
			   type: 'vbox',
			   align: 'center',
			//    align: 'stretch',
			//    pack: 'center',
			}

			,listeners: {
				afterrender: function () {
					Ext.cq1('app-main').doLayout()
				}
			}

		   ,items: [

				{
					type: "component",
					cls: "octo-image-ctr",
					html: '<img class="octo-image" width="650" height="506.22" src="resources/welcome/octopus.png" />',

					autoRender: true,
					autoShow: true,

				},

				{
					autoRender: true,
					autoShow: true,

					type: "component",
					cls: "octo-text-ctr",
					html: '<img class="octo-text" width="625.75" height="117" src="resources/welcome/text.png" />',

					margin: "-150 0 0 0",
				},

				{
					autoRender: true,
					autoShow: true,

					type: "component",
					cls: "octo-button-ctr",
					html: '<img class="octo-button" width="324" height="60" src="resources/welcome/button.png" />',

					margin: "30 0 0 0",

					listeners: {
						render: function(c) {
							c.getEl().on({
								click: function (e) {
									let pTab = Ext.cq1('app-main').getComponent('plusTab')
									Ext.cq1('app-main').setActiveTab(pTab)
								}
							})
						}
					}
				},

			// 	{
			// 		xtype: 'component'
			// 	   ,hideMode: 'offsets'
			// 	   ,autoRender: true
			// 	   ,autoShow: true
			// 	   ,autoEl: {
			// 			tag: 'webview'
			// 		   ,src: 'welcome.html'
			// 		   ,style: 'width:100%;height:100%;visibility:visible;'
			// 		   ,plugins: 'true'
			// 		   ,allowtransparency: 'on'
			// 		   ,autosize: 'on'
			// 	   }
			//    }

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

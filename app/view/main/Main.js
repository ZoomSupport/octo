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
		padding: "18 0 0 0"
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
			,tabConfig: {} // Created empty for Keyboard Shortcuts
			,dock: 'bottom'
			,items: [
				{
					 xtype: 'panel'
					,title: '<h1 class="sel-main-title">Services</h1> <h3 class="sel-sub-title">Select a service you need</h3>' 
					// ,margin: '0 20'
					,flex: 1
					,header: { padding: "30 30" }
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
					,items: [
						{
							 xtype: 'dataview'
							,store: 'ServicesList'
							,itemSelector: 'div.service'
							,tpl: function () {

								var tmp = []
								const types = [
									{
										name: "MESSAGING APPS",
										id: 'messaging'
									},
									{
										name: "E-MAIL",
										id: 'email'
									}
								]

								types.forEach( function (t) {
									tmp.push('<h3 class="main-type-title">'+t.name+'</h3>')
									tmp.push('<div class="services">')
									tmp.push('<tpl for=".">')
									tmp.push('<tpl if="type == \''+t.id+'\' || type == \'custom\'">')
									tmp.push('<div class="service" id="s_{id}">')
									tmp.push('<img src="resources/icons/{logo}" width="48" /><br />')
									tmp.push('<h3 class="title">{name}</h3>')
									tmp.push('</div></tpl></tpl></div>')

								})

								return tmp
							}()
							,emptyText: '<div style="padding: 20px;">'+locale['app.main[3]']+'</div>'
							,listeners: {
								itemclick: 'onNewServiceSelect'
							}
						}
					]
					
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

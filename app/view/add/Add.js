Ext.define('Rambox.view.add.Add',{
	 extend: 'Ext.window.Window'

	,requires: [
		 'Rambox.view.add.AddController'
		,'Rambox.view.add.AddModel',
		,'Rambox.util.License'
	]

	,controller: 'add-add'
	,viewModel: {
		type: 'add-add'
	}

	// private
	,record: null
	,service: null
	,edit: false

	// defaults
	,modal: true
	,width: 500
	,autoShow: true
	,resizable: false
	,draggable: false
	,bodyPadding: "0 20px 15px 20px"

	,padding: "10px 10px 10px 10px"

	,cls: 'add-service-window'

	,titleAlign: 'center'
	// ,iconAlign: 'right'

	,initComponent: function() {
		var me = this;

		me.title = (!me.edit ? locale['app.window[0]'] : locale['app.window[1]']) + ' ' + me.record.get('name');
		me.icon = me.record.get('type') === 'custom' ? (!me.edit ? 'resources/icons/custom.png' : (me.record.get('logo') === '' ? 'resources/icons/custom.png' : me.record.get('logo'))) : 'resources/icons/'+me.record.get('logo');
		me.items = [
			{
				xtype: "component",
				html: "<h3 class='window-title'>"+me.title+"</h3>"
			},
			{
				xtype: "component",
				html: "<span class='hint-text'>Enter required params to set up this service:</span>",

				margin: "0 0 20px 0",

				hidden: !(me.edit ? Ext.getStore('ServicesList').getById(me.record.get('type')).get('note') === '' : me.record.get('note') === '')
			},
			{
				 xtype: 'form'
				,items: [
					{
						 xtype: 'textfield'

						,fieldLabel: locale['app.window[2]']
						,labelWidth: 45
						,labelCls: 'urlLabel'

						,margin: '0 0 30 0'

						,cls: "urlField nameField"
						// ,styles: {
						// 	width: 400
						// }
						// ,width: 400
						// ,flex: 1

						,value: me.record.get('type') === 'custom' ? (me.edit ? me.record.get('name') : '') : me.record.get('name')
						,name: 'serviceName'
						,allowBlank: true
						// ,hidden: true 
						,hidden: me.record.get('type') !== 'custom'
						,listeners: { specialkey: 'onEnter' }
					}
					,{
						 xtype: 'container'
						,layout: 'hbox'
						,name: 'urlContainer'
						,hidden: me.edit ? me.service.get('url').indexOf('___') === -1 && !me.service.get('custom_domain') : me.record.get('url').indexOf('___') === -1 && !me.record.get('custom_domain')
						,items: [
							{
								 xtype: 'label'
								,cls: 'urlLabel'
								,text: locale['app.window[17]']+':'
								,width: 40
							}
							,{
								 xtype: 'button'
								//  xtype: 'label'
								,cls: 'domainField' 
								,text: me.edit ? me.service.get('url').split('___')[0] : me.record.get('url').split('___')[0]
								// ,style: 'border-top-right-radius:0;border-bottom-right-radius:0;'
								,hidden: me.edit ? me.service.get('url').indexOf('___') === -1 ? true : me.service.get('type') === 'custom' || me.service.get('url') === '___' : me.record.get('url').indexOf('___') === -1 ? true : me.record.get('type') === 'custom' || me.record.get('url') === '___'
							}
							,{
								 xtype: 'textfield'
								,cls: "urlField "
								,name: 'url'
								,value: me.edit && me.service.get('url').indexOf('___') >= 0 ? me.record.get('url').replace(me.service.get('url').split('___')[0], '').replace(me.service.get('url').split('___')[1], '') : (me.record.get('url').indexOf('___') === -1 ? me.record.get('url') : '')
								,readOnly: me.edit ? (me.service.get('custom_domain') && me.service.get('url') === me.record.get('url') ? true : me.service.get('url').indexOf('___') === -1 && !me.service.get('custom_domain')) : me.record.get('url').indexOf('___') === -1 && me.record.get('custom_domain')
								,allowBlank: false
								,submitEmptyText: false
								,emptyText: me.record.get('url') === '___' ? 'http://' : ''
								,vtype: me.record.get('url') === '___' ? 'url' : ''
								,listeners: { specialkey: 'onEnter' }
								,flex: 1
							}
							,{
								 xtype: 'cycle'
								,cls: "domainField"
								,showText: true
								,style: 'border-top-left-radius:0;border-bottom-left-radius:0;'
								,hidden: me.edit ? me.service.get('type') === 'custom' || me.service.get('url') === '___' : me.record.get('type') === 'custom' || me.record.get('url') === '___'
								,arrowVisible: me.edit ? (me.service.get('url').indexOf('___') >= 0 && !me.service.get('custom_domain') ? false : me.service.get('custom_domain')) : (me.record.get('url').indexOf('___') >= 0 && !me.record.get('custom_domain') ? false : me.record.get('custom_domain'))
								,menu: {
									items: [
										{
											 text: me.edit ? (me.service.get('url').indexOf('___') === -1 ? 'Official Server' : Ext.String.endsWith(me.service.get('url'), '/') ? me.service.get('url').split('___')[1].slice(0, -1) : me.service.get('url').split('___')[1]) : (me.record.get('url').indexOf('___') === -1 ? 'Official Server' : Ext.String.endsWith(me.record.get('url'), '/') ? me.record.get('url').split('___')[1].slice(0, -1) : me.record.get('url').split('___')[1])
											,checked: me.edit ? (me.service.get('custom_domain') && me.service.get('url') === me.record.get('url') ? true : Ext.String.endsWith(me.record.get('url'), me.service.get('url').split('___')[1])) : true
											,disabled: me.edit ? me.service.get('url') === '___' : me.record.get('url') === '___'
										}
										,{
											 text: 'Custom Server'
											,checked: me.edit ? (me.service.get('custom_domain') && me.service.get('url') === me.record.get('url') ? false : !Ext.String.endsWith(me.record.get('url'), me.service.get('url').split('___')[1])) : false
											,custom: true
											,disabled: me.edit ? !me.service.get('custom_domain') : !me.record.get('custom_domain')
										}
									]
								}
								// Fixes bug EXTJS-20094 for version Ext JS 5
								,arrowHandler: function(cycleBtn, e) {
									if ( !cycleBtn.arrowVisible ) cycleBtn.hideMenu();
								}
								,changeHandler: function(cycleBtn, activeItem) {
									Ext.apply(cycleBtn.previousSibling(), {
										 emptyText: activeItem.custom ? 'http://' : ' '
										,vtype: activeItem.custom ? 'url' : ''
									});
									cycleBtn.previousSibling().applyEmptyText();
									cycleBtn.previousSibling().reset();

									if ( me.edit && cycleBtn.nextSibling().originalValue !== '2' ) {
										me.service.get('custom_domain') && !activeItem.custom ? cycleBtn.previousSibling().reset() : cycleBtn.previousSibling().setValue('');
									} else if ( me.edit && cycleBtn.nextSibling().originalValue === '2' ) {
										me.service.get('custom_domain') && !activeItem.custom ? cycleBtn.previousSibling().setValue( me.service.get('url').indexOf('___') === -1 && me.service.get('custom_domain') ? me.service.get('url') : '') : cycleBtn.previousSibling().reset();
									} else if ( !me.edit && cycleBtn.nextSibling().originalValue === '1' ) {
										activeItem.custom ? cycleBtn.previousSibling().setValue('') : cycleBtn.previousSibling().reset();
									}

									cycleBtn.previousSibling().previousSibling().setHidden(activeItem.custom ? true : me.edit ? me.service.get('url').indexOf('___') === -1 ? true : me.service.get('type') === 'custom' || me.service.get('url') === '___' : me.record.get('url').indexOf('___') === -1 ? true : me.record.get('type') === 'custom' || me.record.get('url') === '___');

									cycleBtn.previousSibling().setReadOnly( activeItem.custom ? false : (me.edit ? me.service.get('url').indexOf('___') === -1 : me.record.get('url').indexOf('___') === -1) );
									cycleBtn.nextSibling().setValue( activeItem.custom ? 2 : 1 );
								}
							}
							,{
								 xtype: 'hiddenfield'
								,name: 'cycleValue'
								,value: me.edit ? (me.service.get('custom_domain') && me.service.get('url') === me.record.get('url') ? 1 : (!Ext.String.endsWith(me.record.get('url'), me.service.get('url').split('___')[1]) ? 2 : 1)) : 1
							}
						]
					}
					,{
						 xtype: 'textfield'
						,cls: "urlField urlLogo"

						,fieldLabel: locale['app.window[18]']
						,labelWidth: 40
						,labelCls: 'urlLabel'

						,emptyText: 'http://url.com/image.png'
						,name: 'logo'
						,vtype: me.record.get('type') === 'custom' ? 'url' : ''
						,value: me.record.get('type') === 'custom' ? (me.edit ? me.record.get('logo') : '') : me.record.get('logo')
						,allowBlank: true
						,hidden: me.record.get('type') !== 'custom'

						// ,flex: 1
						,growMin: 450
						,growMax: 450

						,margin: '20 0 0 0'
						,listeners: { specialkey: 'onEnter' }
					}
					,{
						 xtype: 'fieldset'
						,title: locale['app.window[3]']
						,margin: '10 0 0 0'
						,hidden: true
						,items: [
							{
								 xtype: 'checkboxgroup'
								,columns: 2
								,items: [
									{
										 xtype: 'checkbox'
										,boxLabel: locale['app.window[4]']
										,checked: me.edit ? (me.record.get('align') === 'right' ? true : false) : false
										,name: 'align'
										,uncheckedValue: 'left'
										,inputValue: 'right'
									}
									,{
										 xtype: 'checkbox'
										,boxLabel: locale['app.window[6]']
										,name: 'muted'
										,checked: me.edit ? me.record.get('muted') : false
										,uncheckedValue: false
										,inputValue: true
									}
									,{
										 xtype: 'checkbox'
										,boxLabel: 'Show service name in Tab'
										,name: 'tabname'
										,checked: me.edit ? me.record.get('tabname') : true
										,uncheckedValue: false
										,inputValue: true
									}
									,{
										 xtype: 'checkbox'
										,boxLabel: locale['app.window[5]']
										,name: 'notifications'
										,checked: me.edit ? me.record.get('notifications') : true
										,uncheckedValue: false
										,inputValue: true
									}
									,{
										 xtype: 'checkbox'
										,boxLabel: 'Always display Status Bar'
										,name: 'statusbar'
										,checked: me.edit ? me.record.get('statusbar') : true
										,uncheckedValue: false
										,inputValue: true
									}
									,{
										 xtype: 'checkbox'
										,boxLabel: locale['app.window[19]']
										,name: 'trust'
										,hidden: me.record.get('type') !== 'custom'
										,checked: me.edit ? me.record.get('trust') : true
										,uncheckedValue: false
										,inputValue: true
									}
								]
							}
						]
					}
					,{
						 xtype: 'fieldset'
						,title: 'Unread counter'
						,margin: '10 0 0 0'
						,hidden: true
						,items: [
							{
								 xtype: 'checkboxgroup'
								,columns: 2
								,items: [
									{
										xtype: 'checkbox',
										boxLabel: 'Display tab unread counter',
										name: 'displayTabUnreadCounter',
										checked: me.edit ? me.record.get('displayTabUnreadCounter') : true,
										uncheckedValue: false,
										inputValue: true
									},
									{
										xtype: 'checkbox',
										boxLabel: 'Include in global unread counter',
										name: 'includeInGlobalUnreadCounter',
										checked: me.edit ? me.record.get('includeInGlobalUnreadCounter') : true,
										uncheckedValue: false,
										inputValue: true
									}
								]
							}
						]
					}
					,{
						 xtype: 'fieldset'
						,title: locale['app.window[7]']
						,margin: '10 0 0 0'
						// ,collapsible: true
						// ,collapsed: true
						,hidden: true
						,items: [
							{
								 xtype: 'textarea'
								,fieldLabel: locale['app.window[8]']+' (<a href="https://github.com/saenzramiro/rambox/wiki/Inject-JavaScript-Code" target="_blank">'+locale['app.window[9]']+'</a>)'
								,allowBlank: true
								,name: 'js_unread'
								,value: me.edit ? me.record.get('js_unread') : ''
								,anchor: '100%'
								,height: 120
							}
						]
					}
					,{
						 xtype: 'container'
						,name: "nHint"
						,cls: 'x-window-hint'
						,hidden: (me.edit ? Ext.getStore('ServicesList').getById(me.record.get('type')).get('note') === '' : me.record.get('note') === '')
						,data: { note: (me.edit ? Ext.getStore('ServicesList').getById(me.record.get('type')).get('note') : me.record.get('note')) }
						,margin: '0 0 0 0'
						// ,style: 'background-color:#93CFE0;color:#053767;border-radius:6px;'
						,style: 'color: #4B4F53; font-size: 14pt; font-weight: 400;'
						,tpl: [
							// ,'<div class="notice">'
							// ,'<img class="hint-image" src="resources/tools/info.png">'
							// ,'<i class="fa fa-info-circle" aria-hidden="true" style="font-size:40px;margin:20px;"></i>'
							// ,'<span class="hint-text" style="font-size: 15px; padding: 10px 10px 10px 0;">{note}</span>'
							,'<span class="hint-text">{note}</span>'
							// ,'</div>'
							,
						]
					}
				]
			}
		];

		me.buttons = [
			'->'
			,{
				 text: locale['button[1]']
				,ui: 'decline'
				,handler: 'doCancel'
				,cls: 'main-cancel'
				,padding: '12 15' 

				,margin: '0 0 20 0'
			}
			,{
				 text: me.title
				,itemId: 'submit'
				,handler: 'doSave'
				,cls: 'main-submit'
				,padding: '12 15'

				,margin: '0 20 20 5'
			}
		];

		this.callParent(this);
	}

	,listeners: {
		show: 'onShow'
	}
});

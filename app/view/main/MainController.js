Ext.define('Rambox.view.main.MainController', {
	 extend: 'Ext.app.ViewController'

	,alias: 'controller.main'

	// Make focus on webview every time the user change tabs, to enable the autofocus in websites
	,onTabChange: function( tabPanel, newTab, oldTab ) {
		var me = this;

		// Set Google Analytics event

		console.log('[EVENT] onTabChange', newTab);
		
		if (newTab.id === 'upgradeTab') {
			Ext.create('Rambox.view.popup.Popup', {
				oldTab: oldTab,
			})
			return;
		}

		ga_storage._trackPageview('/'+newTab.title, newTab.title);

		if (
			newTab.id === 'settingsTab' || 
			newTab.id === 'notificationsTab' || 
			newTab.id === 'upgradeTab' ||
			newTab.id === 'welcomeTab'
		) {
			return;
		}

		if ( newTab.id === 'ramboxTab' ) {

			console.log('Rambox Tab');
			
			

			// Resets First Time Plus Click Event
			if (!localStorage.getItem('plusClicked')) {

				// RESET
				ipc.send('resetNotificationTimer')

				localStorage.setItem('plusClicked', true)

				ga_storage._trackEvent('Application', 'Get Started', "Add service on Welcome screen ");
				FB.AppEvents.logEvent('Add service on Welcome screen');
			}

			// Stop Plus timeout
			if (localStorage.getItem('plusTimeout') == 'true') {
				// clearTimeout(plusTimeout)
				localStorage.setItem('plusTimeout', 'false')
			}

			// Track Appealing Plus Click
			if (localStorage.getItem('appealingPlus') == 'true') {
				console.log("Highleted Plus Click")

				// RESET TIMEOUT
				ipc.send('resetNotificationTimer')

				// GA track Plus button clicks
				ga_storage._trackEvent('Application', 'Get Started', "Add second service on Welcome screen ");
				FB.AppEvents.logEvent('Add second service on Welcome screen');

				// clearTimeout(plusTimeout)

				const tab = Ext.cq1('app-main').getComponent('plusTab') 
				tab.setIcon('resources/tools/add.png')
				localStorage.setItem('appealingPlus', false)
			}

			// Tracks First Plus Click
			// if (Ext.getStore('Services').data.length === 0) {
			// 	ga_storage._trackEvent('Application', 'Get Started', "Add service on Welcome screen ");
			// 	FB.AppEvents.logEvent('Add service on Welcome screen');
			// }
			
			if ( Rambox.app.getTotalNotifications() > 0 ) {
				document.title = 'Rambox ('+ Rambox.app.getTotalNotifications() +')';
			} else {
				document.title = 'Rambox';
			}

			// Clears Search Field
			var searchField = Ext.getCmp('main-search-field')
			searchField.setValue("")

			return;
		}

		if (!newTab.record.get('enabled') ) {
			return;
		}

		var webview = newTab.down('component').el.dom;
		if ( webview ) webview.focus();

		// Update the main window so it includes the active tab title.
		if ( Rambox.app.getTotalNotifications() > 0 ) {
			document.title = 'Rambox ('+ Rambox.app.getTotalNotifications() +') - ' + newTab.record.get('name');
		} else {
			document.title = 'Rambox - ' + newTab.record.get('name');
		}
	}

	,updatePositions: function(tabPanel, tab) {
		console.log('[EVENT] updatePositions')
		if ( 
			tab.id === 'ramboxTab' || 
			tab.id === 'tbfill' || 
			tab.id === 'settingsTab' || 
			tab.id === 'upgradeTab' || 
			tab.id === 'notificationsTab' ||
			tab.id === 'welcomeTab'
		) return true;

		console.log('Updating Tabs positions...');

		var store = Ext.getStore('Services');
		store.suspendEvent('remove');
		Ext.each(tabPanel.items.items, function(t, i) {
			if ( 
				t.id !== 'ramboxTab' && 
				t.id !== 'tbfill' && 
				t.id !== 'settingsTab' && 
				t.id !== 'upgradeTab' && 
				t.id !== 'notificationsTab' && 
				t.id !== 'welcomeTab' &&
				t.record.get('enabled') 
			) {
				var rec = store.getById(t.record.get('id'));
				if ( rec.get('align') === 'right' ) i--;
				rec.set('position', i);
				rec.save();
			}
		});

		store.load();
		store.resumeEvent('remove');
	}

	,showServiceTab: function( grid, record, tr, rowIndex, e ) {
		if ( e.position.colIdx === 0 ) { // Service Logo
			Ext.getCmp('tab_'+record.get('id')).show();
		}
	}

	,onRenameService: function(editor, e) {
		var me = this;

		e.record.commit();

		// Change the title of the Tab
		Ext.getCmp('tab_'+e.record.get('id')).setTitle(e.record.get('name'));
	}

	,onEnableDisableService: function(cc, rowIndex, checked) {
		var rec = Ext.getStore('Services').getAt(rowIndex);

		if ( !checked ) {
			Ext.getCmp('tab_'+rec.get('id')).destroy();
		} else {
			Ext.cq1('app-main').insert(rec.get('align') === 'left' ? rec.get('position') : rec.get('position')+1, {
				 xtype: 'webview'
				,id: 'tab_'+rec.get('id')
				,title: rec.get('name')
				,icon: rec.get('type') !== 'custom' ? 'resources/icons/'+rec.get('logo') : ( rec.get('logo') === '' ? 'resources/icons/custom.png' : rec.get('logo'))
				,src: rec.get('url')
				,type: rec.get('type')
				// ,muted: rec.get('muted')
				,sound: rec.get('sound')
				,includeInGlobalUnreadCounter: rec.get('includeInGlobalUnreadCounter')
				,displayTabUnreadCounter: rec.get('displayTabUnreadCounter')
				,enabled: rec.get('enabled')
				,record: rec
				,tabConfig: {
					service: rec
				}
			});
		}
	}

	,onNewServiceSelect: function( view, record, item, index, e ) {
		// console.log("Element Click", view, record, item, index, e)

		
		
		const maxServices = 2 // Maximum ammount of non premium services
		const serviceCnt = Ext.getStore('Services').data.length // Current service number

		const rec_id = item.getAttribute('id').split('_')[1]

		let rc = {}
		Ext.getStore('ServicesList').each(function (rec) {
			if (rec.id === rec_id) {
				rc = rec
				return false
			}
		})

		// Track search result
		var searchField = Ext.getCmp('main-search-field')
		var searchValLen = searchField.getValue().length
		
		if (searchValLen > 0)
			ga_storage._trackEvent('Application', 'Search', rc.name);

		/**
		 * Check if exceded messanger limits
		 */
		// if (serviceCnt >= maxServices && !(localStorage.getItem('activated') == 'true')) {
		if (serviceCnt >= maxServices && !(localStorage.getItem('activated') == 'true')) {
			ga_storage._trackEvent('Application', 'Upgrade to PRO Shown')
			FB.AppEvents.logEvent('Upgrade to PRO Shown');

			// RESET
			if (!localStorage.getItem('ntfPremium')) {
				ipc.send('resetNotificationTimer')
				localStorage.setItem('ntfPremium', true)
			} 

			Ext.create('Rambox.view.popup.Popup', {
				record: rc
			})

			// clearTimeout(stgsTimeout)
			localStorage.setItem('stgsTimeout', false)
			return;
		}

		Ext.create('Rambox.view.add.Add', {
			record: rc
		});
	}

	,removeServiceFn: function(serviceId) {
		if ( !serviceId ) return false;

		// Get Tab
		var tab = Ext.getCmp('tab_'+serviceId);
		// Get Record
		var rec = Ext.getStore('Services').getById(serviceId);

		if (!tab) return false;

		// console.log(tab)

		// Clear all trash data
		if ( rec.get('enabled') && tab.down('component').el ) {
			tab.down('component').el.dom.getWebContents().session.clearCache(Ext.emptyFn);
			tab.down('component').el.dom.getWebContents().session.clearStorageData({}, Ext.emptyFn);
		}

		// Remove record from localStorage
		Ext.getStore('Services').remove(rec);

		// Close tab
		tab.close();
	}

	,removeService: function( gridView, rowIndex, colIndex, col, e, rec, rowEl ) {
		var me = this;

		// Ext.Msg.confirm(locale['app.window[12]'], locale['app.window[13]']+' <b>'+rec.get('name')+'</b>?', function(btnId) {
		// 	if ( btnId === 'yes' ) me.removeServiceFn(rec.get('id'));
		// });

		me.removeServiceFn(rec.get('id'))
	}

	,removeAllServices: function(btn, callback) {
		var me = this;

		// Clear counter for unread messaging
		document.title = 'Rambox';

		if ( btn ) {
			Ext.Msg.confirm(locale['app.window[12]'], locale['app.window[14]'], function(btnId) {
				if ( btnId === 'yes' ) {
					Ext.cq1('app-main').suspendEvent('remove');
					Ext.getStore('Services').load();
					Ext.Array.each(Ext.getStore('Services').collect('id'), function(serviceId) {
						me.removeServiceFn(serviceId);
					});
					if ( Ext.isFunction(callback) ) callback();
					Ext.cq1('app-main').resumeEvent('remove');
					document.title = 'Rambox';
				}
			});
		} else {
			Ext.cq1('app-main').suspendEvent('remove');
			Ext.getStore('Services').load();
			Ext.Array.each(Ext.getStore('Services').collect('id'), function(serviceId) {
				me.removeServiceFn(serviceId);
			});
			if ( Ext.isFunction(callback) ) callback();
			Ext.cq1('app-main').resumeEvent('remove');
			document.title = 'Rambox';
		}
	}

	,configureService: function( gridView, rowIndex, colIndex, col, e, rec, rowEl ) {
		Ext.create('Rambox.view.add.Add', {
			 record: rec
			,service: Ext.getStore('ServicesList').getById(rec.get('type'))
			,edit: true
		});
	}

	,onSearchRender: function( field ) {
		field.focus(false, 1000);
	}

	,onSearchEnter: function( field, e ) {
		var me = this;

		if ( e.getKey() == e.ENTER && Ext.getStore('ServicesList').getCount() === 2 ) { // Two because we always shows Custom Service option
			me.onNewServiceSelect(field.up().down('dataview'), Ext.getStore('ServicesList').getAt(0));
			me.onClearClick(field);
		}
	}

	,doTypeFilter: function( cg, newValue, oldValue ) {
		var me = this;

		Ext.getStore('ServicesList').getFilters().replaceAll({
			fn: function(record) {
				return Ext.Array.contains(Ext.Object.getKeys(cg.getValue()), record.get('type')) || record.get('type') === 'custom';
			}
		});
	}

	,onSearchServiceChange: function(field, newValue, oldValue) {
		var me = this;

		var bd = Ext.cq1('app-main').getComponent('plusTab').body.dom//.scrollTop('top', 0)
		bd.scrollTop = 0

		// var cmps = Ext.ComponentQuery.query(".service-group-ctr")
		// console.log(cmps)

		// var cg = field.up().down('checkboxgroup');
		if ( !Ext.isEmpty(newValue) && newValue.length > 0 ) {
			field.getTrigger('clear').show();
			field.getTrigger('search').hide();

			Ext.getCmp('msg-container-search').show()
			Ext.getCmp('msg-container-messaging').hide()
			Ext.getCmp('msg-container-email').hide()
			Ext.getCmp('msg-container-others').hide()
			Ext.getCmp('msg-container-tool').hide()

			Ext.getStore('ServicesList').getFilters().replaceAll({
				fn: function(record) {
					if ( record.get('type') === 'custom' ) return true;
					// if ( !Ext.Array.contains(Ext.Object.getKeys(cg.getValue()), record.get('type')) ) return false;
					return record.get('name').toLowerCase().indexOf(newValue.toLowerCase()) > -1 ? true : false;
				}
			});
		} else {
			field.getTrigger('clear').hide();
			field.getTrigger('search').show();

			Ext.getCmp('msg-container-search').hide()
			Ext.getCmp('msg-container-messaging').show()
			Ext.getCmp('msg-container-email').show()
			Ext.getCmp('msg-container-others').show()
			Ext.getCmp('msg-container-tool').show()

			Ext.getStore('ServicesList').getFilters().removeAll();
			// me.doTypeFilter(cg);
		}
		field.updateLayout();
	}

	,onClearClick: function(field, trigger, e) {
		var me = this;

		// var cg = field.up().down('checkboxgroup');

		field.reset();
		field.getTrigger('clear').hide();
		field.updateLayout();

		Ext.getStore('ServicesList').getFilters().removeAll();
		// me.doTypeFilter(cg);
	}

	// ,dontDisturb: function(btn, e, called) {
	,dontDisturb: function(enabled) {
		// console.info('Dont Disturb:', btn.pressed ? 'Enabled' : 'Disabled');
		console.info('Dont Disturb:', enabled ? 'Enabled' : 'Disabled');

		// Google Analytics Event
		ga_storage._trackEvent('Application', "Don't Disturb", ( enabled ? 'on' : 'off' ));

		Ext.Array.each(Ext.getStore('Services').collect('id'), function(serviceId) {
			// Get Tab
			var tab = Ext.getCmp('tab_'+serviceId);

			if ( !tab ) return; // Skip disabled services

			// Mute sounds
			// tab.setAudioMuted(btn.pressed ? true : tab.record.get('muted'), true);
			// tab.setAudioMuted(enabled ? true : tab.record.get('muted'), true);
			tab.setAudioMuted(enabled ? true : !tab.record.get('sound'), true);

			// Prevent Notifications
			// tab.setNotifications(btn.pressed ? false : tab.record.get('notifications'), true);
			tab.setNotifications(enabled ? false : tab.record.get('notifications'), true);
		});

		// localStorage.setItem('dontDisturb', btn.pressed);
		localStorage.setItem('dontDisturb', enabled);

		// ipc.send('setDontDisturb', btn.pressed);
		ipc.send('setDontDisturb', enabled);

		// btn.setText(locale['app.main[16]']+': ' + ( btn.pressed ? locale['app.window[20]'] : locale['app.window[21]'] ));

		// If this method is called from Lock method, prevent showing toast
		// if ( !e ) return;
		// Ext.toast({
		// 	 html: btn.pressed ? 'ENABLED' : 'DISABLED'
		// 	,title: 'Don\'t Disturb'
		// 	,width: 200
		// 	,align: 't'
		// 	,closable: false
		// });
	}

	,lockRambox: function(btn) {
		var me = this;

		if ( ipc.sendSync('getConfig').master_password ) {
			Ext.Msg.confirm(locale['app.main[19]'], 'Do you want to use the Master Password as your temporal password?', function(btnId) {
				if ( btnId === 'yes' ) {
					setLock(ipc.sendSync('getConfig').master_password);
				} else {
					showTempPass();
				}
			});
		} else {
			showTempPass();
		}

		function showTempPass() {
			var msgbox = Ext.Msg.prompt(locale['app.main[19]'], locale['app.window[22]'], function(btnId, text) {
				if ( btnId === 'ok' ) {
					var msgbox2 = Ext.Msg.prompt(locale['app.main[19]'], locale['app.window[23]'], function(btnId, text2) {
						if ( btnId === 'ok' ) {
							if ( text !== text2 ) {
								Ext.Msg.show({
									 title: locale['app.window[24]']
									,message: locale['app.window[25]']
									,icon: Ext.Msg.WARNING
									,buttons: Ext.Msg.OK
									,fn: me.lockRambox
								});
								return false;
							}

							setLock(Rambox.util.MD5.encypt(text));
						}
					});
					msgbox2.textField.inputEl.dom.type = 'password';
				}
			});
			msgbox.textField.inputEl.dom.type = 'password';
		}

		function setLock(text) {
			console.info('Lock Rambox:', 'Enabled');

			// Save encrypted password in localStorage to show locked when app is reopen
			localStorage.setItem('locked', text);

			// Google Analytics Event
			// ga_storage._trackEvent('Usability', 'locked');

			me.lookupReference('disturbBtn').setPressed(true);
			me.dontDisturb(me.lookupReference('disturbBtn'), false, true);

			me.showLockWindow();
		}
	}

	,showLockWindow: function() {
		var me = this;

		var validateFn = function() {
			if ( localStorage.getItem('locked') === Rambox.util.MD5.encypt(winLock.down('textfield').getValue()) ) {
				console.info('Lock Rambox:', 'Disabled');
				localStorage.removeItem('locked');
				winLock.close();
				me.lookupReference('disturbBtn').setPressed(false);
				me.dontDisturb(me.lookupReference('disturbBtn'), false);
			} else {
				winLock.down('textfield').reset();
				winLock.down('textfield').markInvalid('Unlock password is invalid');
			}
		};

		var winLock = Ext.create('Ext.window.Window', {
			 maximized: true
			,closable: false
			,resizable: false
			,minimizable: false
			,maximizable: false
			,draggable: false
			,onEsc: Ext.emptyFn
			,layout: 'center'
			,bodyStyle: 'background-color:#2e658e;'
			,items: [
				{
					 xtype: 'container'
					,layout: 'vbox'
					,items: [
						{
							 xtype: 'image'
							,src: 'resources/Icon.png'
							,width: 256
							,height: 256
						}
						,{
							 xtype: 'component'
							,autoEl: {
								 tag: 'h1'
								,html: locale['app.window[26]']
								,style: 'text-align:center;width:256px;'
						   }
						}
						,{
							 xtype: 'textfield'
							,inputType: 'password'
							,width: 256
							,listeners: {
								specialkey: function(field, e){
									if ( e.getKey() == e.ENTER ) {
										validateFn();
									}
								}
							}
						}
						,{
							 xtype: 'button'
							,text: locale['app.window[27]']
							,glyph: 'xf13e@FontAwesome'
							,width: 256
							,scale: 'large'
							,handler: validateFn
						}
					]
				}
			]
		}).show();
		winLock.down('textfield').focus(1000);
	}

	,openPreferences: function( btn ) {
		var me = this;

		Ext.create('Rambox.view.preferences.Preferences').show();
	}

	,login: function(btn) {
		var me = this;

		Rambox.ux.Auth0.login();
	}

	,logout: function(btn) {
		var me = this;

		var logoutFn = function(callback) {
			Ext.Msg.wait(locale['app.window[37]'], locale['app.main[21]']);

			// Google Analytics Event
			// ga_storage._trackEvent('Users', 'loggedOut');

			// Logout from Auth0
			Rambox.ux.Auth0.logout();

			Ext.cq1('app-main').getViewModel().set('username', '');
			Ext.cq1('app-main').getViewModel().set('avatar', '');

			if ( Ext.isFunction(callback) ) callback();

			Ext.Msg.hide();
		}

		if ( btn ) {
			Ext.Msg.confirm(locale['app.main[21]'], locale['app.window[38]'], function(btnId) {
				if ( btnId === 'yes' ) {
					logoutFn(function() {
						me.removeAllServices();
					});
				}
			});
		} else {
			logoutFn();
		}
	}

	,showDonate: function( btn ) {
		Tooltip.API.show('zxzKWZfcmgRtHXgth');
	},


	notButton: function (btn) {

		console.log('Settings Click')
	},

	setActiveTab: function (panel, tab, oldTab) {
		console.log("[EVENT] setActiveTab")

        try {
            let thisTab = tab || {}

            if (!thisTab || typeof thisTab.id === 'undefined') return false;

            switch (thisTab.id) {
                // case 'upgradeTab':
                //     Ext.create('Rambox.view.popup.Popup')
                //     return false
                //     break;

                case 'notificationsTab':
                    var dontDisturb = (localStorage.getItem('dontDisturb') == 'true');
                    this.dontDisturb(!dontDisturb)
                    var dontDisturb = (localStorage.getItem('dontDisturb') == 'true');

					// var notText = (dontDisturb) ? "Notifications " : "Notifications On"
                    // panel.getTabBar().getComponent('notTab').setStyle({
                    //     opacity: (dontDisturb == 'true') ? 0.2 : 1
					// })
					let dIcon = (dontDisturb) ? "resources/tools/notifications_off.png" : "resources/tools/notifications.png"
					let txt = (dontDisturb) ? "Don't Disturb: On" : "Don't Disturb: Off"

                    panel.getTabBar().getComponent('notTab').setIcon(dIcon)
					// Ext.getCmp('notificationsTab').setTitle(txt)
					if (dontDisturb) {
						Ext.getCmp('notTab').addCls('active')
					} else {
						Ext.getCmp('notTab').removeCls('active')
					}

					// Ext.getCmp('notificationsTab').setStyle({
					// 	opacity: (dontDisturb) ? 1 : 0.8
					// })

                    return false
                    break;

				case 'settingsTab':
					// console.log(localStorage.getItem('appealingSettings'))
					this.clearSettingsState()
					
                    break;
            }

            // if (thisTab.id === "notificationsTab" || thisTab.id === "upgradeTab") return false;
            if (thisTab.id === "notificationsTab") return false;
        } catch (err) {
            console.log(thisTab)
            console.log(err)
        }
	}

	,clearSettingsState: function () {
		// clearTimeout(stgsTimeout)
		localStorage.setItem('stgsTimeout', false)

		// RESET
		if (localStorage.getItem('appealingSettings') == 'true') ipc.send('resetNotificationTimer')
		
		localStorage.setItem('appealingSettings', false)

		const tab = Ext.cq1('app-main').getComponent('setTab')
		tab.setIcon('resources/tools/settings.png')
	}
});

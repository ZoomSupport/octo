/**
* Created by whiskeredwonder on 7/30/2015.
*/
Ext.define('Rambox.ux.mixin.Badge', {
	extend: 'Ext.Mixin',

	requires: [
		//require this for the override
		'Ext.button.Button'
	],

	mixinConfig: {
		id: 'badge',
		after: {
			onRender: 'renderBadgeText'
		}
	},

	config: {
		badgeText: null
	},

	renderBadgeText: function() {
		var badgeText = this.getBadgeText();

		if (badgeText) {
			this.updateBadgeText(badgeText);
		}
	},

	updateBadgeText: function(badgeText, oldBadgeText) {
		var me = this,
			el = me.el;

		if (me.rendered) {
			el.set({
				'data-badge-text': badgeText !== '0' ? badgeText : ''
			});

			el.toggleCls(Ext.baseCSSPrefix + 'badge', /*!! badgeText*/ badgeText.length > 0 && badgeText !== '0' );
			me.fireEvent('badgetextchange', me, badgeText, oldBadgeText);

			// console.log(el, "BADGE TEXT: "+badgeText)
			// el.toggleCls(Ext.baseCSSPrefix + 'badge', !! badgeText);

		}
	}
}, function(BadgeMixin) {
	Ext.override(Ext.button.Button, {
		mixins: [BadgeMixin]
	});
});

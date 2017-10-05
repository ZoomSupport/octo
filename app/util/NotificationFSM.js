
const PUBLIC_STATE_0 = 0
const PUBLIC_STATE_1 = 1
const PUBLIC_STATE_2 = 2
const PUBLIC_STATE_3 = 3
const PUBLIC_STATE_4 = 4
const PUBLIC_STATE_5 = 5

Ext.define('Rambox.util.FSM', {
    singleton: true,

    curState: 0,

    states: [
        "STATE_0",
        "STATE_1",
        "STATE_2",
        "STATE_3",
        "STATE_4",
        "STATE_5"
    ],

    setState: function (i) {
        this.curState = i

        ipc.send('resetNotificationTimer')
    },

    getState: function () {

    }
})
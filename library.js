// nodebb-plugin-audio-control

const Settings   = require.main.require('./src/settings')
const Sockets    = require.main.require('./src/socket.io/index')
const SioPlugins = require.main.require('./src/socket.io/plugins')
const SioAdmin   = require.main.require('./src/socket.io/admin')

let settings = {}

exports.load = ({app, router, middleware}) => { return new Promise((resolve, reject) => {
	const render = (req, res, next) => res.render('admin/plugins/audio-control', { })

	router.get('/admin/plugins/audio-control', middleware.admin.buildHeader, render)
	router.get('/api/admin/plugins/audio-control', render)
	router.get('/audio-control/config', (req, res) => res.status(200))

	const defaultSettings = { 'source': '' }

	settings = new Settings('audio-control', '0.0.1', defaultSettings)

	SioAdmin.settings.syncAudioControl = function () {
		settings.sync(function () {
			Sockets.in("online_users").emit('audioUpdate', {source: this.cfg._.source})
		})
	}

	SioPlugins.AudioControl = { }
	SioPlugins.AudioControl.initPlayer = function (socket) {
		if (socket.uid) {
			Sockets.in('uid_' + socket.uid).emit('audioInit', {source: settings.get('source')})
		}
	}

	resolve()
})}

exports.adminHeader = (header) => { return new Promise((resolve, reject) => {
	header.plugins.push({
		"route": '/plugins/audio-control',
		"icon": 'fa-volume-up',
		"name": 'Audio Control',
	})

	resolve(header)
})}

exports.addNavigation = (header) => { return new Promise((resolve, reject) => {
	header.push({
		'id': 'navplayer',
		'class': '',
		'route': "#",
		'text': 'Audio Control',
		'title': '',
		'iconClass': 'fa-music',
	})

	resolve(header)
})}



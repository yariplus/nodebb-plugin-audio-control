"use strict";

// When there's nothing left to burn, you have to set yourself on fire.

(function(nbb) {

	var AudioControl = { },
		NodeBB       = { },
		Settings     = nbb.require('./settings'),
		Sockets      = nbb.require('./socket.io/index'),
		SioPlugins   = nbb.require('./socket.io/plugins'),
		SioAdmin     = nbb.require('./socket.io/admin');

	AudioControl.load = function (data, callback) {
		// Delegate arguments
		if (arguments.length === 2) {
			// NodeBB version >=0.6.0
			NodeBB.app = data.app;
			NodeBB.router = data.router;
			NodeBB.middleware = data.middleware;
		}else if(arguments.length === 4 && typeof arguments[3] === 'function') {
			// NodeBB version <=0.5.0
			NodeBB.app = data;
			NodeBB.router = data;
			NodeBB.middleware = callback;
			callback = arguments[3];
		}else{
			return console.log("AudioControl: " + "Failed to load plugin. Invalid arguments found for app.load(). Are you sure you're using a compatible version of NodeBB?");
		}

		function render(req, res, next) {
			res.render('admin/plugins/audio-control', { });
		}

		NodeBB.router.get('/admin/plugins/audio-control', NodeBB.middleware.admin.buildHeader, render);
		NodeBB.router.get('/api/admin/plugins/audio-control', render);
		NodeBB.router.get('/audio-control/config', function (req, res) {
			res.status(200);
		});

		var	defaultSettings = {
			'source': ''
		};

		AudioControl.settings = new Settings('audio-control', '0.0.1', defaultSettings);

		SioAdmin.settings.syncAudioControl = function () {
			AudioControl.settings.sync(function () {
				Sockets.in("online_users").emit('audioUpdate', {source: this.cfg._.source});
			});
		};

		SioPlugins.AudioControl = { };
		SioPlugins.AudioControl.initPlayer = function (socket) {
			if (socket.uid) {
				Sockets.in('uid_' + socket.uid).emit('audioInit', {source: AudioControl.settings.get('source')});
			}
		};

		callback();
	};

	AudioControl.adminHeader = function (custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/audio-control',
			"icon": 'fa-volume-up',
			"name": 'Audio Control'
		});

		callback(null, custom_header);
	};

	// NodeBB version <=0.6.0
	AudioControl.addNavigation = function(header, callback) {
		// if (!AudioControl.settings.get('disableNav')) {
			header.navigation.push({
				"id": 'navplayer',
				"class": '',
				"route": "#",
				"text": '',
				"title": ''
			});

			callback(null, header);
		// }
	};

	module.exports = AudioControl;

})(module.parent);

$(document).ready(function () {
	var $navplayer = $('#navplayer'), ajs;
	if ($navplayer.length) {
		require(['/plugins/nodebb-plugin-audio-control/public/vendor/audio.min.js'], function () {
			socket.on('audioUpdate', function (data) {
				if (!ajs[0].element.paused) {
					ajs[0].load(data.source);
					ajs[0].play();
				}else{
					ajs[0].load(data.source);
				}
			});

			socket.on('audioInit', function (data) {
				$navplayer.append($('<audio preload="none"/>'));
				audiojs.events.ready(function () {
					ajs = audiojs.createAll({preload: false, loop: true, init: function() { var player = this.settings.createPlayer; }});
				});
				ajs[0].load(data.source);
			});

			socket.emit('plugins.AudioControl.initPlayer');
		});
	}
});

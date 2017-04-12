const Gpio = require('onoff')
	.Gpio;
// onoff uses GPIO numbering instead of physical numbering
// https://www.raspberrypi.org/documentation/usage/gpio-plus-and-raspi2/ scroll down to APPENDIX 1. A NOTE ON PIN NUMBERING
// Numbering: http://www.raspberrypi-spy.co.uk/wp-content/uploads/2012/06/Raspberry-Pi-GPIO-Layout-Model-B-Plus-rotated-2700x900.png
const led = new Gpio(22, 'out');

const toggleState = (curr) => curr === 1 ? 0 : 1;

process.on('SIGINT', function () {
	led.unexport();
	// Gracefull exit.
	console.info('Terminating and shutting down...');
	process.exit();
});

const blink = (ledId, {
	state = 1
	, wait = 1000 // ms
	, startMessage
} = {}) => {
	if (typeof state === 'undefined') {
		state = 1;
	}
	if (startMessage) {
		console.log(`${startMessage} ${wait/1000}s`);
	}
	ledId.write(state, err => {
		if (err) {
			console.error(err);
			ledId.unexport();
			process.exit();
		}

		ledId.read((err, value) => {
			state = toggleState(state);

			setTimeout(function () {
				blink(ledId, {
					state
					, wait
				});
			}, wait);
		});

	});
};

blink(led, {
	wait: 500
	, startMessage: 'Blinking interval set to'
});

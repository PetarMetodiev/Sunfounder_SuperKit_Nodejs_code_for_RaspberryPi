const Gpio = require('onoff')
	.Gpio;
// onoff uses GPIO numbering instead of physical numbering
// https://www.raspberrypi.org/documentation/usage/gpio-plus-and-raspi2/ scroll down to APPENDIX 1. A NOTE ON PIN NUMBERING
// Numbering: http://www.raspberrypi-spy.co.uk/wp-content/uploads/2012/06/Raspberry-Pi-GPIO-Layout-Model-B-Plus-rotated-2700x900.png
const led = new Gpio(22, 'out');

const toggleState = (curr) => curr === 1 ? 0 : 1;

process.on('SIGINT', function () {
	// Gracefull exit.
	console.info('Terminating and shutting down...');
	terminate(led);
	// led.unexport();
	// process.exit();
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
			terminate(ledId);
			// ledId.unexport();
			// process.exit();
		}

		if (wait >= 2020) {
			console.info('Reached time limit.');
			console.info('Terminating...');
			terminate(ledId);
		}

		ledId.read((err, value) => {
			state = toggleState(state);

			setTimeout(function () {
				blink(ledId, {
					state
					, wait: ++wait
					, startMessage: 'Interval'
				});
			}, wait);
		});

	});
};

terminate = (...ledIds) => { 
	ledIds.forEach(id => id.unexport());
	process.exit();
}

blink(led, {
	wait: 1
	, startMessage: 'Blinking with interval set to'
});

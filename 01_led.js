const Gpio = require('onoff')
	.Gpio;
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

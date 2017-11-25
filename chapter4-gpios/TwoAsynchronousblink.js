var onoff = require('onoff'); //#A

var Gpio = onoff.Gpio,
  led  = new Gpio(4, 'out'), //#B
  led2 = new Gpio(17,'out'),
  interval;

interval = setInterval(function () { //#C
  var value  = (led.readSync() + 1) % 2; //#D
  led.write(value, function() { //#E
    console.log("Changed LED 1 state to: " + value);
  });
}, 1000);

(function blink(count) {
  if (count <= 0) {
    return led2.unexport();
  }

  led2.read(function (err, value) { // Asynchronous read.
    led2.write(value ^ 1, function (err) { // Asynchronous write.
      console.log("Changed LED 2 state to: " + (value ^ 1));
    });
  });

  setTimeout(function () {
    blink(count - 1);
  }, 1000);
}());

process.on('SIGINT', function () { //#F
  clearInterval(interval);
  led.writeSync(0); //#G
  led.unexport();
  led2.writeSync(0);
  led2.unexport();
  console.log('Bye, bye!');
  process.exit();
});

// #A Import the onoff library
// #B Initialize pin 4 to be an output pin
// #C This interval will be called every 2 seconds
// #D Synchronously read the value of pin 4 and transform 1 to 0 or 0 to 1
// #E Asynchronously write the new value to pin 4
// #F Listen to the event triggered on CTRL+C
// #G Cleanly close the GPIO pin before exiting
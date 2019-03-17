const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('/dev/ttyACM2')
const parser = new Readline()
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

port.pipe(parser)
parser.on('data', function(data){
	data = data.substring(0, data.length - 1);
	if (data === "continue"){
		//port.write("1\n");
		rl.question('How are you today? ', (answer) => {
		 	port.write(answer+"\n");
  			rl.close();
		});
	} else {
		console.log(data);
	}
})

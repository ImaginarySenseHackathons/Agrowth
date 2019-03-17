const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('/dev/ttyACM0')
const parser = new Readline()
const readline = require('readline');
const express = require('express')
const app = express()
var path = require('path');
const sleep = require('util').promisify(setTimeout)

var lastData = "";
var lastSensorData = [];
var avgValue = 0;
port.pipe(parser)
parser.on('data', function(data){
	data = data.substring(0, data.length - 1);
	lastData = data;
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/updateSensor', (req, res) => {
	if (req.query['sensor'] && req.query['status']) {
		port.write("1" + req.query['sensor']+ req.query['status']  + "\n");
//		res.send({"msg":"sensor updated"});

	} else {
//		res.send({"msg":"Invalid Parameters"});
	}
res.redirect('/');
})
app.get('/requestData', (req, res) => {
	port.write("2\n");
	setTimeout(function() {
		lastSensorData = JSON.parse(lastData);
		res.send(lastSensorData);
	}, 1000);
})

app.get('/sendData', (req, res) => {
	sendData();
	res.send("data has been sended");
})

function sendData() {
	var values = 0;
	var count = 0;
	for (var index in lastSensorData) {
		if (lastSensorData[index]["sensor"].value){
			values += lastSensorData[index]["sensor"].value;
			count += 1;
		}
	}
	if (isNaN(values))
		values = 0;
	if (isNaN(count))
		count = 0;
	avgValue = (values/count).toFixed(2);
	port.write("3" + avgValue + "\n");
}

app.get('/', function (req, res) {
		port.write("2\n");
		setTimeout(function() {
			lastSensorData = JSON.parse(lastData);
			lastSensorData.sort(function(a, b) {
			if (a.sensor['value']) {
				return false;
			}
    			return true;
  		});
		sendData();
    		res.render('index',{data: lastSensorData, avg: avgValue});
	}, 1000);

});

app.listen(3000, () => console.log('Agrowth app listening on port 3000!'))

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
	sendData();
}, the_interval);

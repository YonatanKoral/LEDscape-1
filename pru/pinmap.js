var shell = require('shelljs');
var stripJsonComments = require("strip-json-comments");
var XXH = require('xxhashjs');

var pinData = [
	{ header: 8, headerPin:  1, gpioNum: 0  , name: "GND"        },
	{ header: 8, headerPin:  2, gpioNum: 0  , name: "GND"        },
	{ header: 8, headerPin:  3, gpioNum: 38 , name: "GPIO1_6"    },
	{ header: 8, headerPin:  4, gpioNum: 39 , name: "GPIO1_7"    },
	{ header: 8, headerPin:  5, gpioNum: 34 , name: "GPIO1_2"    },
	{ header: 8, headerPin:  6, gpioNum: 35 , name: "GPIO1_3"    },
	{ header: 8, headerPin:  7, gpioNum: 66 , name: "TIMER4"     },
	{ header: 8, headerPin:  8, gpioNum: 67 , name: "TIMER7"     },
	{ header: 8, headerPin:  9, gpioNum: 69 , name: "TIMER5"     },
	{ header: 8, headerPin: 10, gpioNum: 68 , name: "TIMER6"     },
	{ header: 8, headerPin: 11, gpioNum: 45 , name: "GPIO1_13"   },
	{ header: 8, headerPin: 12, gpioNum: 44 , name: "GPIO1_12"   },
	{ header: 8, headerPin: 13, gpioNum: 23 , name: "EHRPWM2B"   },
	{ header: 8, headerPin: 14, gpioNum: 26 , name: "GPIO0_26"   },
	{ header: 8, headerPin: 15, gpioNum: 47 , name: "GPIO1_15"   },
	{ header: 8, headerPin: 16, gpioNum: 46 , name: "GPIO1_14"   },
	{ header: 8, headerPin: 17, gpioNum: 27 , name: "GPIO0_27"   },
	{ header: 8, headerPin: 18, gpioNum: 65 , name: "GPIO2_1"    },
	{ header: 8, headerPin: 19, gpioNum: 22 , name: "EHRPWM2A"   },
	{ header: 8, headerPin: 20, gpioNum: 63 , name: "GPIO1_31"   },
	{ header: 8, headerPin: 21, gpioNum: 62 , name: "GPIO1_30"   },
	{ header: 8, headerPin: 22, gpioNum: 37 , name: "GPIO1_5"    },
	{ header: 8, headerPin: 23, gpioNum: 36 , name: "GPIO1_4"    },
	{ header: 8, headerPin: 24, gpioNum: 33 , name: "GPIO1_1"    },
	{ header: 8, headerPin: 25, gpioNum: 1  , name: "GPIO1_0"    },
	{ header: 8, headerPin: 26, gpioNum: 61 , name: "GPIO1_29"   },
	{ header: 8, headerPin: 27, gpioNum: 86 , name: "GPIO2_22"   },
	{ header: 8, headerPin: 28, gpioNum: 88 , name: "GPIO2_24"   },
	{ header: 8, headerPin: 29, gpioNum: 87 , name: "GPIO2_23"   },
	{ header: 8, headerPin: 30, gpioNum: 89 , name: "GPIO2_25"   },
	{ header: 8, headerPin: 31, gpioNum: 10 , name: "UART5_CTSN" },
	{ header: 8, headerPin: 32, gpioNum: 11 , name: "UART5_RTSN" },
	{ header: 8, headerPin: 33, gpioNum: 9  , name: "UART4_RTSN" },
	{ header: 8, headerPin: 34, gpioNum: 81 , name: "UART3_RTSN" },
	{ header: 8, headerPin: 35, gpioNum: 8  , name: "UART4_CTSN" },
	{ header: 8, headerPin: 36, gpioNum: 80 , name: "UART3_CTSN" },
	{ header: 8, headerPin: 37, gpioNum: 78 , name: "UART5_TXD"  },
	{ header: 8, headerPin: 38, gpioNum: 79 , name: "UART5_RXD"  },
	{ header: 8, headerPin: 39, gpioNum: 76 , name: "GPIO2_12"   },
	{ header: 8, headerPin: 40, gpioNum: 77 , name: "GPIO2_13"   },
	{ header: 8, headerPin: 41, gpioNum: 74 , name: "GPIO2_10"   },
	{ header: 8, headerPin: 42, gpioNum: 75 , name: "GPIO2_11"   },
	{ header: 8, headerPin: 43, gpioNum: 72 , name: "GPIO2_8"    },
	{ header: 8, headerPin: 44, gpioNum: 73 , name: "GPIO2_9"    },
	{ header: 8, headerPin: 45, gpioNum: 70 , name: "GPIO2_6"    },
	{ header: 8, headerPin: 46, gpioNum: 71 , name: "GPIO2_7"    },
	{ header: 9, headerPin:  1, gpioNum: 0  , name: "GND"        },
	{ header: 9, headerPin:  2, gpioNum: 0  , name: "GND"        },
	{ header: 9, headerPin:  3, gpioNum: 0  , name: "VDD_3V3EXP" },
	{ header: 9, headerPin:  4, gpioNum: 0  , name: "VDD_3V3EXP" },
	{ header: 9, headerPin:  5, gpioNum: 0  , name: "VDD_5V"     },
	{ header: 9, headerPin:  6, gpioNum: 0  , name: "VDD_5V"     },
	{ header: 9, headerPin:  7, gpioNum: 0  , name: "SYS_5V"     },
	{ header: 9, headerPin:  8, gpioNum: 0  , name: "SYS_5V"     },
	{ header: 9, headerPin:  9, gpioNum: 0  , name: "PWR_BUT"    },
	{ header: 9, headerPin: 10, gpioNum: 0  , name: "SYS_RESETn" },
	{ header: 9, headerPin: 11, gpioNum: 30 , name: "UART4_RXD"  },
	{ header: 9, headerPin: 12, gpioNum: 60 , name: "GPIO1_28"   },
	{ header: 9, headerPin: 13, gpioNum: 31 , name: "UART4_TXD"  },
	{ header: 9, headerPin: 14, gpioNum: 50 , name: "EHRPWM1A"   },
	{ header: 9, headerPin: 15, gpioNum: 48 , name: "GPIO1_16"   },
	{ header: 9, headerPin: 16, gpioNum: 51 , name: "EHRPWM1B"   },
	{ header: 9, headerPin: 17, gpioNum: 5  , name: "I2C1_SCL"   },
	{ header: 9, headerPin: 18, gpioNum: 4  , name: "I2C1_SDA"   },
	{ header: 9, headerPin: 19, gpioNum: 13 , name: "I2C2_SCL"   },
	{ header: 9, headerPin: 20, gpioNum: 12 , name: "I2C2_SDA"   },
	{ header: 9, headerPin: 21, gpioNum: 3  , name: "UART2_TXD"  },
	{ header: 9, headerPin: 22, gpioNum: 2  , name: "UART2_RXD"  },
	{ header: 9, headerPin: 23, gpioNum: 49 , name: "GPIO1_17"   },
	{ header: 9, headerPin: 24, gpioNum: 15 , name: "UART1_TXD"  },
	{ header: 9, headerPin: 25, gpioNum: 117, name: "GPIO3_21"   },
	{ header: 9, headerPin: 26, gpioNum: 14 , name: "UART1_RXD"  },
	{ header: 9, headerPin: 27, gpioNum: 115, name: "GPIO3_19"   },
	{ header: 9, headerPin: 28, gpioNum: 113, name: "SPI1_CS0"   },
	{ header: 9, headerPin: 29, gpioNum: 111, name: "SPI1_MISO"  }, // Was SPI1_D0 (Input)
	{ header: 9, headerPin: 30, gpioNum: 112, name: "SPI1_MOSI"  }, // Was SPI1_D1 (Output)
	{ header: 9, headerPin: 31, gpioNum: 110, name: "SPI1_CLK"   },
	{ header: 9, headerPin: 32, gpioNum: 0  , name: "VDD_ADC"    },
	{ header: 9, headerPin: 33, gpioNum: 0  , name: "AIN4"       },
	{ header: 9, headerPin: 34, gpioNum: 0  , name: "GNDA_ADC"   },
	{ header: 9, headerPin: 35, gpioNum: 0  , name: "AIN6"       },
	{ header: 9, headerPin: 36, gpioNum: 0  , name: "AIN5"       },
	{ header: 9, headerPin: 37, gpioNum: 0  , name: "AIN2"       },
	{ header: 9, headerPin: 38, gpioNum: 0  , name: "AIN3"       },
	{ header: 9, headerPin: 39, gpioNum: 0  , name: "AIN0"       },
	{ header: 9, headerPin: 40, gpioNum: 0  , name: "AIN1"       },
	{ header: 9, headerPin: 41, gpioNum: 20 , name: "CLKOUT2"    },
	{ header: 9, headerPin: 42, gpioNum: 7  , name: "GPIO1_7"    },
	{ header: 9, headerPin: 43, gpioNum: 0  , name: "GND"        },
	{ header: 9, headerPin: 44, gpioNum: 0  , name: "GND"        },
	{ header: 9, headerPin: 45, gpioNum: 0  , name: "GND"        },
	{ header: 9, headerPin: 46, gpioNum: 0  , name: "GND"        }
];


var pinsByHeaderAndPin         = global.pinsByHeaderAndPin         = {9:[], 8: []};
var pinsByGpioNum              = global.pinsByGpioNum              = {9:[], 8: []};
var pinsByGpioBankAndBit       = global.pinsByGpioBankAndBit       = {};
var pinsByOriginalChannelIndex = global.pinsByOriginalChannelIndex = {};
var pinsByName                 = global.pinsByName                 = {};
var pinsByGpioFullName         = global.pinsByGpioFullName         = {};
var pinsByHeaderName           = global.pinsByHeaderName           = {};
var pinsByMappedChannelIndex   = global.pinsByMappedChannelIndex   = [];
var pinsByDataChannelIndex     = global.pinsByDataChannelIndex     = [];
var pinsByClockChannelIndex    = global.pinsByClockChannelIndex    = [];
var pinsByPruNum               = global.pinsByPruNum               = [];

pinData.forEach(function(d){
	d.gpioBank = parseInt(d.gpioNum / 32);
	d.gpioBit = d.gpioNum % 32;
	d.gpioName = d.gpioBank + "_" + d.gpioBit;
	d.gpioFullName = "GPIO" + d.gpioName;
	d.headerName = "P" + d.header + "_" + d.headerPin;

	pinsByHeaderName[d.headerName] = d;
	pinsByName[d.name] = d;
	pinsByGpioFullName[d.gpioFullName] = d;

	pinsByHeaderAndPin[d.header][d.headerPin] = d;
	pinsByGpioNum[d.gpioNum] = d;
	pinsByGpioBankAndBit[d.gpioBank] = pinsByGpioBankAndBit[d.gpioBank] || [];
	pinsByGpioBankAndBit[d.gpioBank][d.gpioBit] = d;
});

var bitsUsedByBank = [
	[2, 3, /*4, 5,*/ 7, 8, 9, 10, 11, 14, 20, 22, 23, 26, 27, 30, 31],
	[12, 13, 14, 15, 16, 17, 18, 19, 28],

	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, /*24,*/ 25],
	[14, 15, 16, 17]
];

var originalChannelIndex = 0;
var totalUsedPinCount = 0;
bitsUsedByBank.forEach(function(usedInBank, bankNum){
	usedInBank.forEach(function(bitNum){
		totalUsedPinCount ++;

		pinsByOriginalChannelIndex[originalChannelIndex] = pinsByGpioBankAndBit[bankNum][bitNum];
		pinsByGpioBankAndBit[bankNum][bitNum].used = true;
		pinsByGpioBankAndBit[bankNum][bitNum].originalChannelIndex = originalChannelIndex;

		originalChannelIndex++;
	});
});

var Color = {
	black: 30
	, blue: 34
	, cyan: 36
	, green: 32
	, magenta: 35
	, red: 31
	, yellow: 33
	, grey: 90
	, brightBlack: 90
	, brightRed: 91
	, brightGreen: 92
	, brightYellow: 93
	, brightBlue: 94
	, brightMagenta: 95
	, brightCyan: 96
	, brightWhite: 97
}

var defaultCellSize = 5;
var rowStr = "";
function cell(str, color, cellSize) {
	color = color || null;
	cellSize = cellSize || defaultCellSize;

	str = "" + str;
	var paddingHalf = (cellSize - str.length) / 2;
	for (var i=0; i<Math.ceil(paddingHalf); i++) { str = " " + str };
	for (var i=0; i<Math.floor(paddingHalf); i++) { str = str + " " };

	if (color) { rowStr += "\x1b[01;" + color + "m"; }
	rowStr += str;
	if (color) { rowStr += "\x1b[0m"; }
}

function endRow() {
	console.info(rowStr);
	rowStr = "";
}

function printPinTable(title, f) {
	var headerColumnsWidth = defaultCellSize*3 + 8*2;
	cell(title, Color.brightBlue, headerColumnsWidth*2 + defaultCellSize);
	endRow();

	cell("Row", Color.brightMagenta);
	cell("Pin#", Color.brightMagenta);
	cell("P9", Color.blue, 24);
	cell("Pin#", Color.brightMagenta);
	cell("|", null, 4);
	cell("Pin#", Color.brightMagenta);
	cell("P8", Color.blue, 24);
	cell("Pin#", Color.brightMagenta);
	cell("Row", Color.brightMagenta);
	endRow();

	for (var row=0; row<23; row++) {
		cell(row+1, Color.cyan);
		cell(row*2+1, Color.yellow);
		cell(f(pinsByHeaderAndPin[9][row*2+1]), Color.brightGreen, 12);
		cell(f(pinsByHeaderAndPin[9][row*2+2]), Color.brightGreen, 12);
		cell(row*2+2, Color.yellow);
		cell("|", null, 4);
		cell(row*2+1, Color.yellow);
		cell(f(pinsByHeaderAndPin[8][row*2+1]), Color.brightGreen, 12);
		cell(f(pinsByHeaderAndPin[8][row*2+2]), Color.brightGreen, 12);
		cell(row*2+2, Color.yellow);
		cell(row+1, Color.cyan);
		endRow();
	}
	endRow();
}

function writeSync(fname, data) {
	var fd = fs.openSync(fname, "w");
	fs.writeSync(fd, data);
	fs.closeSync(fd);
}

global.applyPerPruClockMapping = function(
	pinsPerPru
) {
	pinsByPruNum.length = 0;
	pinsByDataChannelIndex.length = 0;

	pinData.forEach(function(pin) {
		pin.pruIndex = pin.mappedChannelIndex < 24 ? 0 : 1;
		pin.pruPin = pin.mappedChannelIndex - (pin.pruIndex * 24);
		pin.pruDataChannel = pin.pruPin;

		if (pin.pruPin < pinsPerPru) {
			var newChannel = pin.pruIndex * pinsPerPru + pin.pruPin;

			pin.dataChannelIndex = newChannel;
			pinsByDataChannelIndex[newChannel] = pin;

			(pinsByPruNum[pin.pruIndex] = pinsByPruNum[pin.pruIndex]||[])[pin.pruPin] = pin;
		}
	});
};


global.applyInterlacedClockPinMapping = function(
	pinsPerPru
) {
	pinsByPruNum.length = 0;
	pinsByDataChannelIndex.length = 0;

	var totalPinCount = pinsPerPru * 2;

	pinData.forEach(function(pin) {
		pin.pruIndex = pin.mappedChannelIndex < pinsPerPru ? 0 : 1;
		pin.pruPin = pin.mappedChannelIndex - (pin.pruIndex * pinsPerPru);

		if (pin.mappedChannelIndex < totalPinCount) {
			if (pin.pruPin % 2 == 1) {
				// Data Pin
				pin.dataChannelIndex = Math.floor(pin.mappedChannelIndex / 2);
				pinsByDataChannelIndex[pin.dataChannelIndex] = pin;

				pin.pruDataChannel = Math.floor(pin.pruPin / 2);
			} else {
				pin.clockChannelIndex = Math.floor(pin.mappedChannelIndex / 2);
				pinsByClockChannelIndex[pin.clockChannelIndex] = pin;

				pin.pruClockChannel = Math.floor(pin.pruPin / 2);
			}

			(pinsByPruNum[pin.pruIndex] = pinsByPruNum[pin.pruIndex]||[])[pin.pruPin] = pin;
		}
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Program Commands
var Commands = {
	"tables": function(){
		printPinTable("GPIO: BANK_BIT", function(p){ return p.gpioNum ? p.gpioName : "" });
		printPinTable("GPIO: Global Number", function(p){ return p.gpioNum || "" });
		printPinTable("Original Channel Index", function(p){ return p.originalChannelIndex!=undefined ? p.originalChannelIndex : "" });
		printPinTable("Mapped Channel Index", function(p){ return p.mappedChannelIndex!=undefined ? p.mappedChannelIndex : "" });

		printPinTable("Unused Channels", function(p){ return (p.originalChannelIndex==undefined & p.gpioNum) ? p.gpioName : "" });
		printPinTable("NAME", function(p){ return p.name });

		console.info("Total Used Pins: " + totalUsedPinCount);
	},

	"pinout": function(){
		printPinTable("Internal Channel Index", function(p){ return p.mappedChannelIndex!=undefined ? p.mappedChannelIndex : "" });
	},

	"mapping-data": function() {
		console.info('\t"mappedPinNumberToPinDesignator": {');
		pinData
			.filter(function(pin){ return pin.mappedChannelIndex !== undefined })
			.sort(function(a, b) { return a.mappedChannelIndex - b.mappedChannelIndex})
			.forEach(function(pin) {
				console.info('\t\t"' + pin.mappedChannelIndex + '": "' + pin.headerName + '", // GPIO' + pin.gpioName + ', ' + pin.name);
			}, {});
		console.info("\t}");
	},

	"pru-setup": function(options, arguments) {
		var tempDir = shell.tempdir() + "/ledscape";
		if (typeof(options.tempDir) === "string") {
			tempDir = options.tempDir;
		}

		var modeName = options.mode;
		if (typeof(modeName) !== "string") {
			usage("--mode requires an argument");
		}

		var channelCount = options["channel-count"] | 0;
		if (!(channelCount > 0 && channelCount <= 48)) {
			usage("--channel-count must be an integer between 1 and 48")
		}

		process.stderr.write("tempDir: " + tempDir + "\n");
		shell.mkdir('-p', tempDir);
		shell.cp("-f", __dirname + "/jstemplates/common.p.h", tempDir);

		function buildProgram(pruNum) {
			var asmGenerationResult = generatePruProgram(modeName, pruNum, channelCount);

			function pathOf(name) { return tempDir + "/" + name; }

			var programName = modeName + "-" + mappingFilename.match(/.*?([^\/\.]+)(\..+)?/)[1] + "-pru" + pruNum;
			var asmCodeHash = XXH(asmGenerationResult.pruCode, 0x243F6A88).toString(16);

			var asmFileName = programName + ".p";
			var binFileName = programName + ".bin";
			var hashFileName = programName + ".xxh";

			if (!shell.test("-e", pathOf(hashFileName)) || shell.cat(pathOf(hashFileName)) != asmCodeHash) {
				asmCodeHash.to(pathOf(hashFileName));

				asmGenerationResult.pruCode.to(pathOf(asmFileName));

				execOrDie(
					"Compiling " + pathOf(asmFileName),
					"cd '" + tempDir + "'; " + __dirname + "/../am335x/pasm/pasm -V3 -b " + asmFileName
				);
			} else {
				console.error("Existing PRU Code Matches hash for " + pathOf(asmFileName));
			}

			return {
				binFile: pathOf(binFileName),
				usedPins: asmGenerationResult.usedPins
			}
		}

		var pru0Result = buildProgram(0);
		var pru1Result = buildProgram(1);

		var usedPins = pru0Result.usedPins.concat(pru1Result.usedPins);

		if (shell.test("-d", '/sys/class/gpio')) {
			usedPins.forEach(function (pin) {
				if (pin.mappedChannelIndex !== undefined) {
					process.stderr.write("Pin " + pin.mappedChannelIndex + " (" + pin.headerName + "):");

					try {
						writeSync("/sys/class/gpio/export", pin.gpioNum);
						process.stderr.write("\n  export OK;");
					} catch (e) {
						process.stderr.write("\n  export FAIL: echo " + pin.gpioNum + " > /sys/class/gpio/export");
						process.stderr.write("\n    " + e);
					}

					try {
						writeSync("/sys/class/gpio/gpio" + pin.gpioNum + "/direction", "out");
						process.stderr.write("\n  direction OK;");
					} catch (e) {
						process.stderr.write("\n  direction FAIL: echo out > /sys/class/gpio/gpio" + pin.gpioNum + "/direction");
						process.stderr.write("\n    " + e);
					}

					try {
						writeSync("/sys/class/gpio/gpio" + pin.gpioNum + "/value", 0);
						process.stderr.write("\n  value OK;");
					} catch (e) {
						process.stderr.write("\n  value FAIL: echo 0 > /sys/class/gpio/gpio" + pin.gpioNum + "/value");
						process.stderr.write("\n    " + e);
					}

					process.stderr.write("\n");
				}
			});
		} else {
			console.error("No /sys/class/gpio... Skipping pin setup.");
		}

		console.info("PRU0:", pru0Result.binFile);
		console.info("PRU1:", pru1Result.binFile);
	}
};

function execOrDie(
	description,
	commandStr
) {
	var result = shell.exec(commandStr, { silent: true });
	if (result.code !== 0) {
		console.error("FAILED: " + description + " (" + result.code + "): " + commandStr);
		console.error(result.output.split("\n").join("\n  "));
		shell.exit(-1);
	}
	else {
		console.error("SUCCESS: " + description +": " + commandStr);
		return result;
	}
}

function generatePruProgram(modeName, pruNum, globalChannelCount) {
	var template = require("./jstemplates/" + modeName);
	return template(__dirname + "/jstemplates/", pruNum, globalChannelCount);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bootstrap
var mappingFilename = "original-ledscape";

function usage(error) {
	if (error) {
		console.error(error);
		console.info();
	}
	console.info("Usage: " + process.execPath + " [--mapping mappingFile] [tables | pru-headers]");
	process.exit(error ? -1 : 0);
}

var commandFunc = Commands.pinout;
var optionMap = {};
var lastOptName = null;
var parsedArgs = [];

process.argv.forEach(function(arg, i) {
	function parseArg(a) {
		if (a === "true") return true;
		if (a === "false") return false;
		if (a === "null") return null;
		if (!isNaN(a)) return 1 * a;
		return a;
	}

	if (arg === "-h" || arg === "-?") {
		usage();
	}

	else if (arg in Commands) {
		commandFunc = Commands[arg];
	}

	else if (arg.substring(0, 2) == "--") {
		lastOptName = arg.substring(2);
		optionMap[lastOptName] = true;
	}

	else if (arg.substring(0, 1) == "-") {
		lastOptName = arg.substring(1);
		optionMap[lastOptName] = true;
	}

	else {
		if (lastOptName !== null) {
			optionMap[lastOptName] = parseArg(arg);
		} else {
			parsedArgs.push(parseArg(arg));
		}
		lastOptName = null;
	}
});

if ("mapping" in optionMap) {
	if (optionMap.mapping === true) {
		usage("--mapping requires an argument");
	} else {
		mappingFilename = optionMap.mapping;
	}
}

var fs = require('fs');
var path = require('path');

// Look for the mapping file in various places... allow the name of the mapping with or without an extension and
// allow references to the mappings in the relative directory mappings/
var validPaths = [
	mappingFilename,
	mappingFilename + ".json",
	path.dirname(require.main.filename) + "/mappings/" + mappingFilename,
	path.dirname(require.main.filename) + "/mappings/" + mappingFilename + ".json"
].filter(fs.existsSync);

if (validPaths.length == 0) {
	usage("Could not find mapping: " + mappingFilename);
}

var pinMapping;
try {
	pinMapping = JSON.parse(stripJsonComments(fs.readFileSync(validPaths[0], "utf8")));
} catch (e) {
	console.error(e);
	usage("Failed to parse mapping at " + validPaths[0] + "\n");
}

process.stderr.write("Mapping: " + mappingFilename + " (" + pinMapping.name + ")\n");

function mapPinToChannel(
	pin,
	channel
) {
	pinsByMappedChannelIndex[channel] = pin;
	pin.mappedChannelIndex = channel;
}

if (pinMapping.mappedPinNumberToPinDesignator) {
	var mappedCount = 0;

	var mappedPinNumberToPinDesignator = pinMapping.mappedPinNumberToPinDesignator;

	for (var i in mappedPinNumberToPinDesignator) if (mappedPinNumberToPinDesignator.hasOwnProperty(i)) {
		var designator = ("" + pinMapping.mappedPinNumberToPinDesignator[i]).toUpperCase().trim();
		var pin = pinsByHeaderName[designator] || pinsByName[designator] || pinsByGpioFullName[designator];

		if (pin) {
			mapPinToChannel(pin, i);
			mappedCount++;
		} else {
			throw new Error("No pin matches designator " + designator + " for pin " + i);
		}
	}

	process.stderr.write("channelCount:  " + mappedCount + "\n");

	commandFunc.call(this, optionMap, parsedArgs);
}

else {
	usage("Invalid mapping file format. No mappedPinNumberToPinDesignator field found.");
}

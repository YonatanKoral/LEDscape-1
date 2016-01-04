import * as fs from 'fs';
import {BasePruProgram} from "./common";
import {pinIndex} from "../bbbPinData";
import {BaseSetupPruProgram} from "./common";

export default class WS281xProgram extends BaseSetupPruProgram {
	private pruChannelCount;

	constructor(
		PRU_NUM: number,
		overallChannelCount: number
	) {
		super(PRU_NUM, overallChannelCount);
		this.pruChannelCount = Math.floor(overallChannelCount/2);
		pinIndex.applySingleDataPinMapping(this.pruChannelCount);
		console.error("Using " + this.pruChannelCount + " channels on PRU" + PRU_NUM);
	}

	protected fileHeader() {
		this.emitComment("//////////////////////////////////////////////////////////////////////////////////////////////////////");
		this.emitComment("WS281x Mapping for PRU" + this.PRU_NUM);
		this.emitComment("Overall Channels: " + this.overallChannelCount);
		this.emitComment("PRU Channels: " + this.pruChannelCount);
		this.emitComment("//////////////////////////////////////////////////////////////////////////////////////////////////////");
	}

	protected frameCode() {
		var g = this;

		g.pruBlock(() => {
			var l_word_loop = g.emitLabel("l_word_loop");

			// Load all the data.
			g.LOAD_CHANNEL_DATA(g.pruPins[0], 0, this.pruChannelCount);

			// for bit in 24 to 0
			g.emitComment("Loop over the 24 bits in a word");
			g.MOV(g.r_bit_num, 24);

			// Bit timings from http://wp.josh.com/2014/05/13/ws2812-neopixels-are-not-so-finicky-once-you-get-to-know-them/
			var ZERO_PULSE_NS  = 200; // 200 - 350 - 500
			var ONE_PULSE_NS   = 500; // 550 - 700 - 5,500
			var INTERBIT_NS    = 400;   // 450 - 600 - 6,000
			var INTERFRAME_NS  = 6000;

			g.pruBlock(() => {
				var l_bit_loop = "l_bit_loop";
				g.emitLabel(l_bit_loop);
				g.DECREMENT(g.r_bit_num);

				g.WAITNS(ZERO_PULSE_NS + ONE_PULSE_NS + INTERBIT_NS, "interbit_wait");

				// Reset the counter
				g.RESET_COUNTER();
				g.r_bit_regs.forEach((reg) =>{
					g.MOV(reg, 0);
				});
				g.PINS_HIGH(g.pruPins);

				g.groupByBank(g.pruPins, (pins, gpioBank, usedBankIndex, usedBankCount) => {
					// Set mask bits for the ZERO bits
					pins.forEach((pin) => {
						g.TEST_BIT_ZERO(pin, g.r_bit_regs[gpioBank]);
					});
				});

				g.WAITNS(ZERO_PULSE_NS, "zero_bits_wait");
				g.groupByBank(g.pruPins, (pins, gpioBank, usedBankIndex, usedBankCount) => {
					g.PREP_GPIO_FOR_CLEAR(gpioBank);
					g.APPLY_GPIO_CHANGES(g.r_bit_regs[gpioBank]);
				});

				g.WAITNS(ZERO_PULSE_NS+ONE_PULSE_NS, "one_bits_wait");
				g.PINS_LOW(g.pruPins);

				g.QBNE(l_bit_loop, g.r_bit_num, 0);
			});

			// The RGB streams have been clocked out
			// Move to the next pixel on each row
			g.ADD(g.r_data_addr, g.r_data_addr, 48 * 4);
			g.DECREMENT(g.r_data_len);
			g.QBNE(l_word_loop, g.r_data_len, 0);
		});
	}
}
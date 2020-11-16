import {AbstractInstrument} from './AbstractInstrument'
import {InstrumentCanvasRenderer} from './InstrumentCanvasRenderer'

export class Instrument extends AbstractInstrument {
	constructor(...args) {
		super(...args, 'instrument-canvas')
	}

	rendererClass() {
		return InstrumentCanvasRenderer
	}
}

import {AbstractInstrument} from './AbstractInstrument'
import {PercussionCanvasRenderer} from './PercussionCanvasRenderer'

export class Percussion extends AbstractInstrument {
	constructor(...args) {
		super(...args, 'percussion-canvas')
	}

	rendererClass() {
		return PercussionCanvasRenderer
	}
}

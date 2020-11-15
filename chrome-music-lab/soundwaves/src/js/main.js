
/********************************************************
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*********************************************************/

import background from './dots'
import createContext from 'webgl-context'
// import tone from 'tone'
import * as Tone from 'tone'
import { render } from 'deku'
import keys from './keys'
import math from './math'
import Piano from './piano'
import StartAudioContext from './start-audio-context'


let gl = createContext({ alpha: true, premultipliedAlpha: false })
let TWOPI = Math.PI * 2.0

// Tone.Master.mute = true
Tone.context.resume()

if (gl) {
	// IOS Shim
	window.parent.postMessage("loaded", "*");
	//send the ready message to the parent
	var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	//full screen button on iOS
	if (isIOS) {
		Tone.startMobile()

		//make a full screen element and put it in front
		// var iOSTapper = document.createElement("div");
		// iOSTapper.id = "iOSTap";
		document.body.addEventListener("touchstart", function (e) {
			console.log('sdfsd')
			e.preventDefault();
		});
		// iOSTapper.style.zIndex = 100
		// document.body.appendChild(iOSTapper);
		StartAudioContext.setContext(Tone.context);
		StartAudioContext.on(document.body);
		StartAudioContext.onStarted(function () {
			// iOSTapper.remove();
			window.parent.postMessage("ready", "*");
		});
	} else {
		window.parent.postMessage("ready", "*");
	}

	// Need some AA, so enable standard derivatives
	gl.getExtension('OES_standard_derivatives')

	// Alpha blending
	gl.enable(gl.BLEND);
	gl.blendEquation(gl.FUNC_ADD);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	// Get face assets
	let zoomOut = document.querySelector('#zoom-out'),
		zoomIn = document.querySelector('#zoom-in'),
		face = document.querySelector('#face')

	// faceAsleep.style.display = 'none'

	window.addEventListener('load', function () {
		face.style.visibility = 'initial'
		gl.canvas.className += ' active'
	})

	let isFocused = false

	face.addEventListener('click', () => isFocused = !isFocused)

	// Add to DOM
	document.querySelector('#content').appendChild(gl.canvas)

	// Make some synths!
	let synth = new Tone.Synth({ oscillator: { type: "sine" } }).toDestination()
	//synth.frequency.value = 0.0

	let amplitude = 0,
		frequency = 0,
		size = 0,
		scale = 1.0,
		keyRatio = 0.8;

	// Define sizing function
	let resize = () => {

		// Position the face
		// face.style.width = window.innerWidth + 'px'
		// face.style.height = ( window.innerHeight * keyRatio ) + 'px'


		let view = [window.innerWidth, (window.innerHeight * keyRatio)]


		// set the height of the keys
		let keys = document.querySelectorAll('.key')
		if (keys) [].forEach.call(keys, (el) => el.style.height = (window.innerHeight * (1.0 - keyRatio)) + 'px')

		let pixelRatio = devicePixelRatio || 1

		gl.canvas.width = view[0] * pixelRatio
		gl.canvas.height = view[1] * pixelRatio
		gl.canvas.style.width = view[0] + 'px'
		gl.canvas.style.height = view[1] + 'px'


		gl.viewport(...getViewport())
	}


	let getViewport = () => {
		let pixelRatio = devicePixelRatio || 1
		let view = [window.innerWidth * pixelRatio, window.innerHeight * pixelRatio * keyRatio]
		size = Math.max(...view)
		let offset = view.map(d => (d - size) * 0.5)
		return [...offset, size, size]
	}

	window.addEventListener('resize', resize);

	let pOffset = 0.0,
		focus = 0.0
	let timeScale = 0.005
	// define the render loop
	function renderStep(t) {

		// Amplitude is a function of the envelope of the synth
		amplitude = math.map(synth.envelope._sig.getValueAtTime(synth.toSeconds()), 0, 0.3, 0, 1 / 25)
		// amplitude = math.map( synth.envelope.value, 0, 0.3, 0, 1/25 )
		amplitude = math.clamp(amplitude, 0, 1 / 25)


		// The frequency needs to be scaled down so it's possible to see. If it's any faster than 60Hz (the screen refresh rate, then you can't really see it)
		// frequency = frequency.value * 0.0005


		// Set the time frame

		// t - tom,e
		let now = t * timeScale
		let delta = now - time
		time = now
		// time = t * timeScale

		// console.log( synth.now()  )

		// Draw the dots
		focus += ((isFocused ? 1.0 : 0.0) - focus) * 0.1
		scale += ((isFocused ? 3.0 : 1.0) - scale) * 0.1
		pOffset += ((isFocused ? .5 : 0.0) - pOffset) * 0.1
		background(gl, time, delta, frequency, amplitude, 100.0, size, scale, focus, getViewport, pOffset, Math.abs(1.0 - focus) <= 0.01)


		// Add a little head wobble
		let displacement = Math.sin(time * 1.5) * 10.0 * math.normalize(synth.envelope.value, 0, 0.3)


		let pixelRatio = devicePixelRatio || 1

		zoomIn.style.display = isFocused ? 'none' : ''
		zoomOut.style.display = isFocused ? '' : 'none'


		// Set the next draw frame
		requestAnimationFrame(renderStep);
	}


	// Some platforms don't maintain AudioParam.value as a value, therfore it cannot be read
	// Below is a hack to read back the property

	// var StatefulTimelineSignal = function(){ Tone.TimelineSignal.apply(this, arguments)}
	// Tone.extend( StatefulTimelineSignal, Tone.TimelineSignal )


	// let signalVale = 0
	// Object.defineProperty( StatefulTimelineSignal.prototype, 'value', {
	// 	get: function () {
	// 	    return this._toUnits(this._param.value);
	// 	},
	// 	set: function (value) {
	// 	    var convertedVal = this._fromUnits(value);
	// 	    this._initial = convertedVal;
	// 	    this._param.value = convertedVal;
	// 	    signalVale = convertedValue
	// 	}
	// });

	// synth


	// Set the initial position
	let time = 0
	// let buttons = keys(( note ) => synth.triggerAttack( note ), () => synth.triggerRelease() )
	// render( buttons, document.body.querySelector( '#keys' ))

	let piano = new Piano(document.querySelector("#keys"));

	const gain = new Tone.Gain();
	// let frequency = 0;
	piano.onkeydown = function (note) {
		piano.keyDown(note);

		frequency = gain.toFrequency(note) * 0.0005
		synth.triggerAttack(note)
	};

	piano.onkeyup = function (note) {
		piano.keyUp(note);
		synth.triggerRelease()
	};

	piano.setHighlightColor("#00b6ee");

	resize()

	requestAnimationFrame(renderStep)
} else {
	console.log('NO GL CONTEXT AVAILABLE')
}
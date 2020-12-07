import 'style/main.scss'

///////////////////////////////////////////////////////////////////////////////
// EMBED ONLY
///////////////////////////////////////////////////////////////////////////////
const embedId = window.location.pathname.indexOf('/embed/') > -1 ? window.location.pathname.match(/\/[0-9]+/i)[0].substr(1) : false
if (embedId) {
	document.body.classList.add('embed-only')
}

///////////////////////////////////////////////////////////////////////////////
// EMBED ONLY
///////////////////////////////////////////////////////////////////////////////
const songId = window.location.pathname.indexOf('/song/') > -1 ? window.location.pathname.match(/\/[0-9]+/i)[0].substr(1) : false


///////////////////////////////////////////////////////////////////////////////
// MODEL
///////////////////////////////////////////////////////////////////////////////

import { bus } from 'data/EventBus'
import { SongOptions } from 'data/SongOptions'
import { MidiData } from 'midi/Data'
import { History } from 'history/History'

new History()
const songOptions = new SongOptions()
const midiData = new MidiData()
songOptions.on('load-success', () => {
	//sound.options.changeInstrument()
	if (modals.loading) {
		modals.loading.close('sampler')
		if (!embedId && !songId) {
			modals.loading.close('grid')
		}
	}
})


///////////////////////////////////////////////////////////////////////////////
// MODALS (loading, so putting at top)
///////////////////////////////////////////////////////////////////////////////

import { LoadingModal } from 'modal/Loading'
const modals = {}
modals.loading = new LoadingModal()

///////////////////////////////////////////////////////////////////////////////
// SOUND
///////////////////////////////////////////////////////////////////////////////

import { Sound } from 'sound/Sound'

const sound = new Sound(songOptions, midiData)

sound.on('export-start', () => {
	topBar.modals.share.exportStart()
})
sound.on('export-complete', () => {
	topBar.modals.share.exportEnd()
})

///////////////////////////////////////////////////////////////////////////////
// GRID UI
///////////////////////////////////////////////////////////////////////////////

import { Grid } from 'grid/Grid'

const grid = new Grid(document.body, songOptions, midiData, sound, !!embedId)
// grid.fitBars()
grid.instrument.on('add', note => {
	sound.resumeContext()
	sound.instrumentTrack.playNote(note, undefined, undefined, 0.8)
})
grid.percussion.on('add', note => {
	sound.resumeContext()
	sound.percussionTrack.playNote(note, undefined, undefined, 0.8)
})
grid.on('load-success', () => {
	if (modals.loading) {
		modals.loading.close('grid')
	}
})


///////////////////////////////////////////////////////////////////////////////
// INPUT
///////////////////////////////////////////////////////////////////////////////

import { InputManager } from 'input/Manager'
const inputManager = new InputManager()
inputManager.registerInstrument(grid.percussion)
inputManager.registerInstrument(grid.instrument, true)
inputManager.on('select', pos => grid.select(pos))
inputManager.on('outofbounds', () => {
	grid.flashSelector()
	sound.bump()
})
inputManager.on('play-delete-sound', () => sound.playDelete())
inputManager.on('song-changed', () => onSongChanged())

function onSongChanged() {
	bottom.songChanged = true
	if (midiData.instrument.timeline._length + midiData.percussion.timeline._length < 1) {
		bottom.disableSaveButton(true)
	} else {
		bottom.disableSaveButton(false)
	}
}

function onSettingsUpdate(options, clear = false) {
	let prevOptions = songOptions.toJSON()
	bus.emit('history:push', {
		type: 'save',
		options: prevOptions,
		timelines: midiData.timelines,
	})
	if (clear) midiData.clear()
	midiData.morph(options, prevOptions)
	songOptions.fromJSON(options)
	sound.syncWithMidiTrack()
	cloud.clear()
}

// REGULAR KEYBOARD
import { KeyboardInput } from 'input/Keyboard'
new KeyboardInput(inputManager)

// MIDI Keyboard
import { Keyboard } from 'keyboard/Keyboard'
const keyboard = new Keyboard(songOptions, inputManager)
keyboard.connected().then(() => {
	bottom.enableKeyboard()
})
keyboard.on('outofbounds', () => {
	grid.flashSelector()
	sound.bump()
})

// MICROPHONE
import { Microphone } from 'mic/Microphone'
const microphone = new Microphone(songOptions, inputManager)
grid.instrument.renderer.registerDrawMethod(microphone.render)


///////////////////////////////////////////////////////////////////////////////
// accessibility
///////////////////////////////////////////////////////////////////////////////

import { TabClickOutline } from 'functions/TabClickOutline'
new TabClickOutline()


///////////////////////////////////////////////////////////////////////////////
// focus
///////////////////////////////////////////////////////////////////////////////

import { WindowFocus } from 'functions/WindowFocus'
const windowFocus = new WindowFocus()
windowFocus.on('focus-change', (bool) => {
	if (!bool && document.body.classList.contains('touch-device')) {
		sound.stop()
	}
})


///////////////////////////////////////////////////////////////////////////////
// TOP BAR
///////////////////////////////////////////////////////////////////////////////

import { TopBar } from 'top/TopBar'

const topBar = new TopBar(document.body, inputManager, midiData)

//when a new song is created
topBar.on('settings-update', onSettingsUpdate)
bus.on('history:pop:save', event => {
	midiData.replace(event.timelines)
	songOptions.fromJSON(event.options)
	sound.syncWithMidiTrack()
	cloud.clear()
})
//call stop when it opens the menus
topBar.on('stop', () => {
	sound.stop()
})
topBar.on('back', () => {
	window.location = '/'
})
topBar.on('restart', () => {
	bottom.firstLoad = true
	bottom.disableSaveButton(true)
})
topBar.on('request-wav', (id) => {
	sound.generateWave(id)
})

topBar.on('request-midi', () => {
	sound.downloadMidi()
})

///////////////////////////////////////////////////////////////////////////////
// SONG MAKER
///////////////////////////////////////////////////////////////////////////////

import { Bottom } from 'bottom/Bottom'

const bottom = new Bottom(document.body, songOptions)
bottom.on('play', start => {
	sound.resumeContext()
	if (start) {
		sound.start('+.1', 0)
	} else {
		sound.stop()
	}
})

bottom.on('play-from-selector', start => {
	sound.resumeContext()
	if (start) {
		let duration = (songOptions.totalBeats * 60 / songOptions.tempo)
		let offset = duration * inputManager.selector.position.x / songOptions.totalSubBeats
		sound.start('+.1', offset)
	} else {
		sound.stop()
	}
})


bottom.on('restart', () => {
	bottom.firstLoad = true
	bottom.disableSaveButton(true)
})
bottom.on('instrument-change', (name) => {
	sound.options.instrument = name
	sound.options.changeInstrument()
	onSongChanged()
})
bottom.on('percussion-change', (name) => {
	sound.options.percussion = name
	sound.options.changeInstrument()
	onSongChanged()
})
bottom.on('tempo', tempo => {
	sound.tempo = tempo
	grid.updateTempo(tempo)
})
bottom.on('undo', () => {
	bus.emit('history:undo')
	if (midiData.instrument.timeline._length + midiData.percussion.timeline._length < 1) {
		bottom.disableSaveButton(true)
	} else {
		bottom.disableSaveButton(false)
	}
	console.log("hello")
})
bottom.on('save', () => {
	cloud.save()
	topBar.triggerShare()
})
bottom.on('stop', () => {
	sound.stop()
})
bottom.on('share', () => {
	topBar.triggerShare('immediate')
})
bottom.on('settings', () => {
	topBar.triggerSettingsModal(songOptions)
})
bottom.on('midi', () => {
	keyboard.recording = !keyboard.recording
	bottom.midiRecording = keyboard.recording
})
bottom.on('mic', async () => {
	sound.stop()
	if (!microphone.recording) {
		await microphone.open()
	}
	microphone.recording = !microphone.recording
})
//when a new song is created
bottom.on('settings-update', onSettingsUpdate)

microphone.on('start', () => {
	// Turn off keyboard if it is on
	keyboard.recording = false
	bottom.micRecording = microphone.recording
	sound.instrumentTrack.setHotMic(true)
	sound.percussionTrack.setHotMic(true)
	inputManager.selector.showNoPick()
})
microphone.on('end', () => {
	bottom.micRecording = microphone.recording
	sound.instrumentTrack.setHotMic(false)
	sound.percussionTrack.setHotMic(false)
})
keyboard.on('start', () => {
	// Turn off micrphone if it is on
	microphone.recording = false
	bottom.midiRecording = keyboard.recording
	sound.instrumentTrack.setHotMic(true)
	sound.percussionTrack.setHotMic(true)
	inputManager.selector.show()
})
keyboard.on('end', () => {
	bottom.midiRecording = keyboard.recording
	sound.instrumentTrack.setHotMic(false)
	sound.percussionTrack.setHotMic(false)
})

microphone.supported().then(supported => {
	if (supported) bottom.enableMicrophone()
})

//click anywhere removes microphone mode
document.body.addEventListener('click', () => {
	microphone.recording = false
	keyboard.recording = false
})

let firstTouch = true
document.body.addEventListener('touchstart', () => {
	if (firstTouch) {
		firstTouch = false
		document.body.classList.add('touch-device')
	}
	microphone.recording = false
	keyboard.recording = false
})

document.body.addEventListener('touchend', () => {
	sound.resumeContext()
})



///////////////////////////////////////////////////////////////////////////////
// CLOUD
///////////////////////////////////////////////////////////////////////////////

import { Cloud } from 'cloud/Cloud'
const cloud = new Cloud(songOptions, midiData)
cloud.emitter.on('save-success', (data) => {
	topBar.triggerShare(data)
})

///////////////////////////////////////////////////////////////////////////////
// EMBED ONLY
///////////////////////////////////////////////////////////////////////////////

if (embedId) {
	cloud.loadSong(embedId)
}


///////////////////////////////////////////////////////////////////////////////
// PRELOAD images
///////////////////////////////////////////////////////////////////////////////

[
	'images/instruments/tonal-marimba.svg',
	'images/instruments/perc-drum-machine.svg',
	'images/icon-mic.svg',
	'images/icon-quantity-add.svg',
	'images/icon-quantity-minus.svg',
	'images/icon-down-caret.svg',
	'images/instruments/tonal-piano.svg',
	'images/instruments/tonal-synth.svg',
	'images/instruments/tonal-violin.svg',
	'images/instruments/tonal-woodwind.svg',
	'images/instruments/perc-woodblock.svg',
	'images/instruments/perc-snare-drum.svg',
	'images/instruments/perc-conga.svg',
	'images/icon-mic-red.svg',
	'images/animated-mic.svg',
	'images/animated-midi.svg'
].forEach((image) => {
	var fakeImg = new Image()
	fakeImg.src = image
})

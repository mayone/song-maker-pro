define(["style/overlay.scss", "midiconvert/build/MidiConvert", "interface/Loader", "Tone/core/Transport"],
    function (overlayStyle, MidiConvert, Loader, Transport) {
        const MIDI_UPLOAD_MSG_ERROR = 'Only MIDI files will work here.';
        const MIDI_UPLOAD_MSG = 'Drop your MIDI file here.';

        var Overlay = function (container, roll, interface) {
            this._roll = roll;
            this._interface = interface;
            this._withinEnter = false;
            this._loader = null;
            this._timeout = null;

            this._overlay = document.createElement("div");
            this._overlay.classList.add("Overlay");
            this._overlay.innerHTML = MIDI_UPLOAD_MSG;
            container.appendChild(this._overlay);

            container.addEventListener('dragover', this._handleDragOver.bind(this));
            container.addEventListener('dragenter', this._handleDragEnter.bind(this));
            container.addEventListener('dragleave', this._handleDragLeave.bind(this));
            container.addEventListener('drop', this._handleDrop.bind(this));
        };

        Overlay.prototype._handleDragOver = function(e) {
            e.preventDefault();
        };

        Overlay.prototype._handleDragLeave = function(e) {
            if (!this._withinEnter) {
                this._overlay.classList.remove('Active');
                this._overlay.innerHTML = MIDI_UPLOAD_MSG;
            }
            this._withinEnter = false;
        };

        Overlay.prototype._handleDragEnter = function(e) {
            e.preventDefault();
            clearTimeout(this._timeout);
            this._withinEnter = true;
            setTimeout(function () {
                this._withinEnter = false;
            }, 0);
            this._overlay.classList.add('Active');

        };

        Overlay.prototype._handleDrop = function(e) {
            e.preventDefault();
            const files = e.dataTransfer.files || e.target.files;
            if (files) {
                const file = files[0];
                if (file.type === 'audio/midi' || file.type === 'audio/mid') {
                    if (Transport.state === "started") {
                        Transport.stop();
                        this._interface.stop();
                        this._interface._playButton.onPlay(false);
                    }

                    this._overlay.classList.remove('Active');
                    this._loader = new Loader();

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var midi = MidiConvert.parse(e.target.result);
                        const maxNotes = Math.max.apply(Math, midi.tracks.map(function (t) {
                            return t.notes.length;
                        }));
                        const longestTrack = midi.tracks.find(function (t) {
                            return t.notes.length === maxNotes;
                        });

                        midi.notes = longestTrack.notes;
                        midi.header.tempo = midi.header.bpm;

                        for (var i = 0; i < midi.notes.length; i++) {
                            var t = midi.notes[i].time;
                            var d = midi.notes[i].duration;
                            midi.notes[i].time = Math.floor(t * 100) + 'i';
                            midi.notes[i].duration = Math.floor(d * 100) + 'i';
                            midi.notes[i].midiNote = midi.notes[i].midi;
                            midi.notes[i].note = midi.notes[i].name;
                        }

                        this._roll.setScore(midi);
                        this._loader.resolve();

                        document.getElementById('PlayPause').classList.add('Shifted');
                        document.querySelectorAll('#Previous, #Next').forEach(function(n) { n.classList.add('Hidden') });
                        document.getElementById('Midi').querySelector('.Text').innerHTML = file.name || "untitled.mid";
                        document.getElementById('Midi').classList.add('Active');
                    }.bind(this);
                    reader.readAsBinaryString(file);

                } else {
                    this._overlay.innerHTML = MIDI_UPLOAD_MSG_ERROR;

                    this._timeout = setTimeout(function() {
                        this._overlay.classList.remove('Active');
                        this._overlay.innerHTML = MIDI_UPLOAD_MSG;
                        this._withinEnter = false;
                    }.bind(this), 2000);
                }
            }
        };

        return Overlay;
    }
);
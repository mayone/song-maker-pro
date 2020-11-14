/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["jquery", "metronome.scss", "jquery-knob", "Tone/core/Transport", "Tone/event/Part", "Tone/instrument/MembraneSynth"], 
	function ($, metroStyle, jqueryKnob, Transport, Part, MembraneSynth) {

	var metronome = $("<div>", {
		"id" : "MetronomeButton",
		"class" : "Button icon-svg_metronome"
	}).appendTo("body")
		.on("click", function(e){
			e.preventDefault();
			e.stopPropagation();
			metronomeOverlay.addClass("Visible");
			blinkyLoop();
			MetroAPI.onopen();
		});

	var metronomeOverlay = $("<div>", {
		"id" : "Metronome",
	}).appendTo("body");


	var metroWheelContainer = $("<div>", {
		"id" : "MetroWheel"
	}).appendTo(metronomeOverlay);

	var metroWheel = $("<input>", {
		"value" : 120,
		"data-min" : 60,
		"data-max" : 200
	}).appendTo(metroWheelContainer).data("width", "80%");

	var checkBox = $("<div>", {
		"id" : "Checkbox",
		"class" : "Button"
	}).appendTo(metroWheelContainer)
		.on("click", function(e){
			e.preventDefault();
			e.stopPropagation();
			MetroAPI.onclose();
			metronomeOverlay.removeClass("Visible");
		});
		
	var wheelHandle = $("<div>", {
		"id" : "WheelHandle",
		"class" : "Button"
	}).appendTo(metroWheelContainer);

	$(window).resize(function(){
		metroWheel.trigger("configure", {
			width : metroWheelContainer.width(),
			height : metroWheelContainer.width(),
		});
	});

	metroWheel.knob({
		width : metroWheelContainer.width(),
		height : metroWheelContainer.width(),
		min : 60,
		max : 200,
		angleArc : 270,
		angleOffset : 225,
		thickness : 0.3,
		lineCap : "round",
		fgColor: "#ffb729",
		draw : function(){
			var theta = this.arc(this.cv).e;
			var halfThickness = (this.o.thickness * this.o.width) / 4;
			var x = Math.cos(theta) * (this.w2 - halfThickness) + this.w2;
			var y = Math.sin(theta) * (this.w2 - halfThickness) + this.w2;
			wheelHandle.css({
				"left" : x,
				"top" : y,
			});
			Transport.bpm.value = this.cv;
		}
	});

	$("<div>", {
		"id" : "Turtle",
		"class" : "Icon icon-svg_slow_man"
	}).appendTo(metroWheelContainer);

	$("<div>", {
		"id" : "Rabbit",
		"class" : "Icon icon-svg_fast_man"
	}).appendTo(metroWheelContainer);

	/**
	 *  BLINKING
	 */
	var blinky = $("<div>", {
		"id" : "Blinky"
	}).appendTo(wheelHandle);

	var metroSynth = new MembraneSynth({
		"volume" : -20,
		"envelope" : {
			"attack" : 0.008,
			"decay" : 0.01,
			"sustain" : 0
		},
		"octaves" : 5,
		"pitchDecay" : 0.1,
		"oscillator" : {
			"type" : "triangle"
		}
	}).toMaster();

	window.metroSynth = metroSynth;


	/**
	 * BLINKING
	 */
	var blinkPart = new Part({
		"loopEnd" : "4n",
		"loop" : true,
		"callback" : function(time){
			if (metronomeOverlay.hasClass("Visible")){
				metroSynth.triggerAttack("C4", time);
			}
		}
	}).add(0).start();

	//blink the button inside the handle
	var twoPi = Math.PI * 2;

	function blinkyLoop(){
		if (metronomeOverlay.hasClass("Visible")){
			if(Transport.state === "stopped"){
				
			} else {
				blinky.css("opacity", (Math.sin(blinkPart.progress * twoPi) + 1) / 2);
			}
			requestAnimationFrame(blinkyLoop);
		} 
	}

	var MetroAPI = {
		onopen : function(){},
		onclose : function(){}
	};

	return MetroAPI;
});
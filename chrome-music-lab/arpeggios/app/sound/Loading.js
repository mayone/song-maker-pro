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

define(["jquery", "loading.scss"], function ($, loadingStyle) {

	var loading = $("<div>", {
		"id" : "Loading",
	});

	var spinner = $("<div>", {
		"class" : "SpinContainer"
	}).appendTo(loading);

	var icon = $("<div>", {
		"class" : "icon-svg_piano Icon"
	}).appendTo(spinner);

	var spinny = $("<div>").appendTo(spinner).html('<svg class="Spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="Circle" fill="none" stroke-width="3" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg>');

	var minTime = 700;
	var loadStart = Date.now();

	function removeLoading(){
		loading.removeClass("Visible");
		setTimeout(function(){
			loading.remove();
		}, 500);
	}

	return {
		load : function(instrument){
			if (instrument === "piano"){
				loadStart = Date.now();
				loading.appendTo("body");
				setTimeout(function(){
					loading.addClass("Visible");
				}, 10);
			}
		},
		resolve : function(){
			var diff = Date.now() - loadStart;
			if (diff > minTime){
				removeLoading();
			} else {
				setTimeout(function(){
					removeLoading();
				}, minTime - diff);
			}
		}
	};
});
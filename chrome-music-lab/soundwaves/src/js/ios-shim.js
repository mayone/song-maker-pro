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

window.parent.postMessage("loaded", "*");
//send the ready message to the parent
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
//full screen button on iOS
if (isIOS){
	//make a full screen element and put it in front
	var iOSTapper = document.createElement("div");
	iOSTapper.id = "iOSTap";
	iOSTapper.addEventListener("touchstart", function(e){
		e.preventDefault();
	});
	document.body.appendChild(iOSTapper);
	StartAudioContext.setContext(Tone.context);
	StartAudioContext.on(iOSTapper);
	StartAudioContext.onStarted(function(){
		iOSTapper.remove();
		window.parent.postMessage("ready","*");
	});
} else {
	window.parent.postMessage("ready","*");
}
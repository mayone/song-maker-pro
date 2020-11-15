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

precision highp float;

attribute vec2 aPosition;

uniform vec2  uOffset;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uRadius;
uniform float uTime;
uniform float uScale;
uniform float uHeight;
uniform vec2 uMask;

// varying float vDistance;

#define TWOPI 6.283185307179586

void main() {


	vec2 position = aPosition * uScale + uOffset;


	// vDistance = length( aPosition - vec2( -0.01, -0.19 ));


	// Intro Animation
	float introTime = uTime * 0.5;
	float awidth = 0.15;
	float theta = 1.0 - smoothstep( introTime-awidth, introTime+awidth, length( vec2( -0.3, 1.0 ) - aPosition ));



	// Sound wave
	float period = 1.0 / uFrequency;
	float wavelength = 0.1;
	float phaseShift = ( 1.0 - aPosition.y ) / wavelength;
	float phase = ( uTime + phaseShift ) / period;	
	float displacementY = sin( phase * TWOPI ) * uAmplitude;


	// Set size and position
	gl_PointSize = uRadius * theta * uScale;
	gl_Position = vec4( position + vec2( 0.0, displacementY ), 0.0, 1.0 );

}
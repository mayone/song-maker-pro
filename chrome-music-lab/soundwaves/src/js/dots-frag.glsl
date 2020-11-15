
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

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp int;
	precision highp float;
#else
	precision mediump int;
	precision mediump float;
#endif

#ifdef GL_OES_standard_derivatives
	#extension GL_OES_standard_derivatives : enable
#endif

#pragma glslify: aa = require(glsl-aastep);

uniform vec4 uColor;
uniform float uOpacity;

// varying float vDistance;

void main(){

	// float focus = aa( vDistance, 0.009 ) * uFocus;
	// float focus = mix( 0.3, 1.0, uFocus );
	
	float value = length( 0.5 - gl_PointCoord.xy );
	value = 1.0 - aa( 0.4, value );
	gl_FragColor = mix( vec4( 1.0 ), uColor, uOpacity );
	gl_FragColor.a = value;// * uOpacity;

}

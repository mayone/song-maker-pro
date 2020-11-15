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

import createShader from 'gl-shader'
import createBuffer from 'gl-buffer'
import createFBO from 'gl-fbo'
import triangle from 'a-big-triangle'
import _ from 'lodash'
import math from './math'
const glsl = require('glslify')

let shader,
	vertexBuffer,
	fbos,
	quadShader,
	current = 0;

const N = 40;
const TWOPI = Math.PI * 2.0

let offset = 1/N*0.5

let lookupVertex = v => [ (v%N)/N + offset, ((v/N)|0)/N + offset ],
	indexVertex = v => N*v[1]+v[0],
	centerVertices = v => v * 2.0 - 1.0

let vertices = _.flatten( _.range( N*N ).map( lookupVertex ))
	vertices = vertices.map( centerVertices )

let indexOffset = indexVertex([19, 15])
console.log( )

export default function( gl, t, delta, freq, amp, radius, size, scale, focus, getDimension, offset, isFocused ){

	if( !shader ){
		// console.log( 'sdfs' )
		

		shader = createShader( gl, glsl( './identity-vert.glsl'), glsl( './dots-frag.glsl'))
		quadShader = createShader( gl, glsl( './quad-vert.glsl'), glsl( './quad-frag.glsl'))

		vertexBuffer = createBuffer( gl, vertices )


		fbos = [ createFBO( gl, [ 512, 512 ], {float:false}), createFBO( gl, [ 512, 512 ], {float:false})]

		
	}	

	// gl.bindFramebuffer( gl.FRAMEBUFFER, null )
	// gl.clearColor( 1, 1, 1, 1 )
	// gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )

	shader.bind()
	vertexBuffer.bind()
	shader.attributes.aPosition.location = 0
	shader.attributes.aPosition.pointer()



	// Set the shader uniforms
	shader.uniforms.uRadius = size / radius
	shader.uniforms.uAmplitude = amp * scale
	shader.uniforms.uFrequency = freq
	shader.uniforms.uScale = scale
	shader.uniforms.uOffset = [ 0.0, offset ]
	// shader.uniforms.uOffset = math.
	shader.uniforms.uOpacity = math.mix( focus, 1.0, 0.15  )
	shader.uniforms.uColor = [ 1/255, 182/255, 240/255, 1 ]
	shader.uniforms.uTime = t
	shader.uniforms.uMask = [0, 1]


	gl.drawArrays( gl.POINTS, 0, vertices.length/2 )


	if( isFocused ) {

		shader.uniforms.uColor = [ 1, 0, 0, 1 ]
		shader.uniforms.uOpacity = 1.0

		// if( window.mouseDown ){

			var prevState = fbos[current]
		  	var curState = fbos[current ^= 1]


			let dimension = getDimension()
			curState.shape = prevState.shape = [dimension[2], dimension[3]]
			

			// // Draw single vertex into fbo
			curState.bind()

				gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )

				
			

				// let i = t - delta;
				// let d = delta / 10
				// let index = 0
				// var step = 0.005 / 10
				// shader.uniforms.uMask = [1, 1]
			// while( t > i ){
				
				shader.uniforms.uTime = t
				
				// shader.uniforms.uOffset = [ 0.005 - ( step * index++ ), offset ]
				
				gl.drawArrays( gl.POINTS, indexOffset, 1 )
				// t -= d

			// }

				quadShader.bind()
				quadShader.uniforms.uOffset = [0.005, 0 ]
				quadShader.uniforms.uFadeEnd = 0
				quadShader.uniforms.uFadeStart = 0
				quadShader.uniforms.uTex = prevState.color[0].bind()
				triangle( gl )
				
			


			gl.bindFramebuffer( gl.FRAMEBUFFER, null )


			// vertexBuffer.unbind()
			gl.viewport( ...dimension )
			
			

			// draw quad
				quadShader.uniforms.uOffset = [-0.005, 0 ]
				quadShader.uniforms.uFadeEnd = 0.15
				quadShader.uniforms.uFadeStart = 0.5
				quadShader.uniforms.iChannel0 = curState.color[0].bind();

				triangle( gl )
			// end draw quad
		// }else{
		// 	gl.drawArrays( gl.POINTS, indexOffset, 1 )
		// }

	}else{

		fbos[0].bind()

		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
		fbos[1].bind()
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )

		gl.bindFramebuffer( gl.FRAMEBUFFER, null )
		gl.viewport( ...getDimension() )

	}
	
}
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

/** @jsx element */
import element from 'virtual-element'
import _ from 'lodash'
import { tree } from 'deku'
import math from './math'


const C_MAJOR = 'D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5 A5 B5 C6 D6'.split(' ')
let numKeys = C_MAJOR.length;
let keyWidth = 'width:'+String( 100/numKeys )+'%;'

window.mouseDown = false

let mix = ( a, b, n ) => a * ( 1 - n ) + b * n;
let mixColor = ( a, b, n ) => a.map(( v, channel ) => mix( v, b[channel], n )|0);

export default function( down, up ){


	let lastKey = null


	return tree(
		<div class="MyApp">
			{ _.range( numKeys ).map(( v, i ) => {  



				let onMouseDown = e => {
					e.preventDefault();
					window.mouseDown = true
					down( C_MAJOR[i] )
				}

				let onMouseUp = e =>{
					e.preventDefault();
					console.log( 'sdfs')
					window.mouseDown = false
					up( C_MAJOR[i] )
				}

				let onMouseOver = () =>{
					if( window.mouseDown ) down( C_MAJOR[i] )
				}

				let onMouseOut = ()=>{
					if( window.mouseDown ) up( C_MAJOR[i] )
				}


				let onTouchMove = (e) => {
					 let v = math.clamp( e.targetTouches[0].clientX / window.innerWidth , 0, 1 )
					 v = math.clamp( math.mix( v, 0, numKeys )|0, 0, numKeys - 1 );
					 // up( C_MAJOR[v] )
					
					 if( lastKey !== v )down( C_MAJOR[v] )
					 lastKey = v
				}


				let color = mixColor( [ 195, 22, 61 ], [254, 229, 70], i/(numKeys-1) );
				let colorString = 'background-color: rgb('+ color.join(',') + ')';
			return <button class='mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect key' 
				onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseOver={onMouseOver} onMouseOut={onMouseOut}
				onTouchStart={onMouseDown} onTouchEnd={onMouseUp} onTouchMove={onTouchMove}
				style={keyWidth+colorString}></button> 
			})}
		</div>
	)
}


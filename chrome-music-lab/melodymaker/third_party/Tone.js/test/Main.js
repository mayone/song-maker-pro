require.config({
	baseUrl:"./",
	paths : {
		"Tone" : "../Tone",
		"Test" : "helper/Test"
	},
});

window.MANUAL_TEST = false;

require(["Test","source/ExternalInput"], function(Test){
	Test.run(); 
});
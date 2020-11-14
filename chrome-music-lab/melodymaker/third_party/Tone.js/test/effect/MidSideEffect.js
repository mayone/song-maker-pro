define(["Tone/effect/Effect", "Tone/effect/MidSideEffect", "helper/Basic"], function (Effect, MidSideEffect, Basic) {

	describe("MidSideEffect", function(){

		Basic(MidSideEffect);

		context("MidSide", function(){

			it ("extends Effect", function(){
				var midSide = new MidSideEffect();
				expect(midSide).to.be.instanceOf(Effect);
				midSide.dispose();
			});

			it ("has a mid and a side send and return", function(){
				var midSide = new MidSideEffect();
				expect(midSide).to.have.property("midSend");
				expect(midSide).to.have.property("midReturn");
				expect(midSide).to.have.property("sideSend");
				expect(midSide).to.have.property("sideReturn");
				midSide.dispose();
			});
		});
	});
});
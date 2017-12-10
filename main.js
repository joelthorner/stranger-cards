StrangerCards.main = {
	init : function () {
		StrangerCards.cards.init();
	}
};

StrangerCards.cards = {
	template : 
		`<figure class="card" id="card-%index%">
			<div class="inset">
				<span class="number"><i>%index%</i></span>
				<div class="bg">
					<img src="%image%" class="tilt-effect">
				</div>
				<div class="caption">
					<b class="title">%name%</b>
					<span class="text">%text%</span>
				</div>
			</div>
		</figure>`,

	init : function () {

		this.insertCards();
		this.effectBg();
		this.reverse();
	},

	insertCards : function() {
		$.each(StrangerCards.data, function(cardIndex, cardVal) {
			var template = StrangerCards.cards.template;

			template = template.replaceAll('%index%', cardIndex);
			
			$.each(cardVal, function(dataIndex, dataVal) {
				template = template.replaceAll('%' + dataIndex + '%', dataVal)
			});

			var $template = $(template);

			$('#card-container').append($template);
		});
	},

	effectBg : function() {
		$('.card').each(function(index, el) {
			var thisId = '#' + $(this).attr('id');

			new TiltFx($(this).find('.bg img')[0], { 
				opacity : 0.8, 
				bgfixed : false, 
				extraImgs : 3, 
				movement: { 
					perspective : 750, 
					translateX : 38, 
					translateY : 15, 
					translateZ : 0, 
					rotateY : 10 
				},
				element : {
					mouseMoveWatcher : thisId
				}
			});
		});
	},

	reverse : function() {
		
	}
};

$(StrangerCards.main.init);
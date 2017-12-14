const DEBUG = false;

StrangerCards.main = {
	init : function () {
		StrangerCards.layout.init();
		StrangerCards.storageUser.init();
		StrangerCards.cards.init();
	}
};

StrangerCards.storageUser = {
	init : function() {
		
		if (!localStorage.getItem('userCards')) {
			localStorage.setItem('userCards', '')
		}
	}
};

StrangerCards.layout = {
	init : function() {
		this.headerLinksEffect();
		this.openCardPackEvent();
	},

	headerLinksEffect : function() {
		$('header .item-a a').each(function(index, el) {
			$(this).after( 
				$(this).clone().addClass('effect-duplicate') 
			)
		});
	},

	openCardPackEvent : function() {
		$('#open-card-pack').click(function(event) {
			event.preventDefault();
			StrangerCards.cards.openDeck();
		});
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

	compiledCards : null,

	init : function () {
		this.compileCards(localStorage.getItem('userCards'));
		this.reverse();
	},

	compileCards : function(listCompileCardsIds) {
		var toCompile = {};

		if (listCompileCardsIds){
			$.each(listCompileCardsIds.split(','), function(index, cardId) {
				toCompile[cardId] = StrangerCards.data[cardId];
			});
		}else if(DEBUG){
			toCompile = StrangerCards.data;
		}

		$.each(toCompile, function(cardIndex, cardVal) {
			var template = StrangerCards.cards.template;

			template = template.replaceAll('%index%', cardIndex);
			
			$.each(cardVal, function(dataIndex, dataVal) {
				template = template.replaceAll('%' + dataIndex + '%', dataVal)
			});

			var $template = $(template);

			$('#card-container').append($template);
		});
		
		this.effectBg();
	},

	effectBg : function() {
		$('.card').each(function(index, el) {
			var thisId = '#' + $(this).attr('id');

			new TiltFx($(this).find('.bg img')[0], { 
				opacity : 0.75, 
				bgfixed : false, 
				extraImgs : 5, 
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


	openDeck : function() {
		var arrAllCardsIds = [];
		$.each(StrangerCards.data, function(index, el) {
			arrAllCardsIds.push(index);
		});
		
		var arrUserCardsIds = (localStorage.getItem('userCards') == '' ? [] : localStorage.getItem('userCards').split(','));

		if (arrUserCardsIds.length == arrAllCardsIds.length) {
			alert('have totes les cards')
		
		}else{
			var newCardPack = "";

			for (var i = 0; i < 5; i++) {
				
				var rand = Math.getRandomInt(0, arrAllCardsIds.length - 1);
				newCardPack = newCardPack + (newCardPack.length ? ',' : '') + arrAllCardsIds[rand];
			}

			// alert('newCardPack: ' + newCardPack);
			// animation opening decks
			
			var arrSaveCardsIds = $.uniqueSort($.merge(arrUserCardsIds, newCardPack.split(','))).join(',');
			
			// sto and render cards:
			this.compileCards(arrSaveCardsIds);

			localStorage.setItem('userCards',  arrSaveCardsIds);
		}
	},

	reverse : function() {
		
	}
};

$(StrangerCards.main.init);
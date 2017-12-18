const DEBUG = false;
const ALLCARDS = false;

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

		if (DEBUG) {
			this.clearAll();
		}
	},

	clearAll : function () {
		$('body').append($('<button/>', {
			id : 'clear-all',
			type : 'button',
			html : 'CLEAR',
			click : function() {
				window.location = window.location;
				localStorage.setItem('userCards', '');
			}
		}))
	}
};

StrangerCards.layout = {
	init : function() {
		this.alertSpoiler();
		this.bodyPadding();
		this.scrollMenu();
		this.headerLinksEffect();
		this.openCardPackEvent();
	},

	alertSpoiler : function() {
		var $modal = $('#disclaimer-spoiler');

		$('.md-overlay, .md-close').click(function(event) {
			$modal.removeClass('md-show')
		});
	},

	bodyPadding : function() {
		$('body').css('padding-top', $('header').outerHeight(true));
		$(window).on('resize', function(event) {
			$('body').css('padding-top', $('header').outerHeight(true));
		});
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
	},

	scrollMenu : function() {
		$(window).on('scroll resize', function(event) {
			var $logo = $('#logo');
			$logo.css('width', '');

			var w = $logo.width() - $(document).scrollTop();
			if (w <= ($logo.width() / 2)) w = ($logo.width() / 2);
			if(window.innerWidth >= 600) $logo.width(w);

			var $header = $('header');
			var bg = 0;
			bg = bg + ($(document).scrollTop() / (window.innerHeight / 2) );
			if (bg >= 0.75) bg = 0.75;
			$header.css('background', 'rgba(0, 0, 0,' + bg + ')');

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
				if(!$('#card-' + cardId).length) 
					toCompile[cardId] = StrangerCards.data[cardId];
			});

		}else if(ALLCARDS){
			toCompile = StrangerCards.data;
		}

		$.each(toCompile, function(cardIndex, cardVal) {
			var template = StrangerCards.cards.template;

			template = template.replaceAll('%index%', cardIndex);
			
			$.each(cardVal, function(dataIndex, dataVal) {
				template = template.replaceAll('%' + dataIndex + '%', dataVal)
			});

			var $template = $(template).addClass('card-type-' + cardVal.type);

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

	completeCollection : function() {
		alert('have totes les cards')
	},

	openDeck : function() {
		
		var arrAllCardsIds = [];
		$.each(StrangerCards.data, function(index, el) {
			arrAllCardsIds.push(index);
		});
		
		var arrUserCardsIds = (localStorage.getItem('userCards') == '' ? [] : localStorage.getItem('userCards').split(','));

		if (arrUserCardsIds.length == arrAllCardsIds.length) {
			
			this.completeCollection();
		
		}else{
			var newCardPack = "";

			for (var i = 0; i < 5; i++) {
				
				var rand = Math.getRandomInt(0, arrAllCardsIds.length - 1);
				newCardPack = newCardPack + (newCardPack.length ? ',' : '') + arrAllCardsIds[rand];
			}

			// alert('newCardPack: ' + newCardPack);
			// animation opening decks
			
			var arrSaveCardsIds = $.uniqueSort($.merge(arrUserCardsIds, newCardPack.split(',')));
			var listSaveCardsIds = arrSaveCardsIds.join(',');
			
			// sto and render cards:
			this.compileCards(listSaveCardsIds);

			localStorage.setItem('userCards', listSaveCardsIds);

			if (arrSaveCardsIds.length == arrAllCardsIds.length) this.completeCollection();
		}
	},

	reverse : function() {
		
	}
};

$(StrangerCards.main.init);
const DEBUG = false;
const ALLCARDS = false;

StrangerCards.main = {
	init : function () {
		StrangerCards.storageUser.init();
		StrangerCards.layout.init();
		StrangerCards.cards.init();
	}
};

StrangerCards.storageUser = {
	init : function() {
		
		this.initStorage('ST_userCards', '');
		this.initStorage('ST_spoilerDisclaimer', true);

		if (DEBUG) {
			this.clearAll();
		}
	},

	initStorage : function(key, initVal) {
		
		if (localStorage.getItem(key) == null) {
			localStorage.setItem(key, initVal)
		}
	},

	clearAll : function () {
		$('body').append($('<button/>', {
			id : 'clear-all',
			type : 'button',
			html : 'CLEAR',
			click : function() {
				window.location = window.location;
				localStorage.setItem('ST_userCards', '');
				localStorage.setItem('ST_spoilerDisclaimer', true);
			}
		}))
	}
};

StrangerCards.layout = {
	init : function() {
		// instant view
		this.alertSpoiler();
		this.bodyPadding();
		this.headerLinksEffect();
		
		// deferred view
		this.scrollMenu();
		this.openCardPackEvent();
	},

	alertSpoiler : function() {
		var $modal = $('#disclaimer-spoiler');
		if (localStorage.getItem('ST_spoilerDisclaimer') == 'true') {
			$('body').addClass('md-show-body');
			$modal.addClass('md-show');
		}


		$('.md-overlay, .md-close').click(function(event) {
			$modal.removeClass('md-show');

			localStorage.setItem('ST_spoilerDisclaimer', false);
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
			var div = window.innerHeight > window.innerWidth ? 2 : 4;
			bg = bg + ($(document).scrollTop() / (window.innerHeight / div) );
			if (bg >= 0.5) bg = 0.5;

			$header.css({
				'background' : 'rgba(3, 8, 21,' + bg + ')'
			});

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
		this.compileCards(localStorage.getItem('ST_userCards'));
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
				extraImgs : 6, 
				movement: { 
					perspective : 750, 
					translateX : 40, 
					translateY : 30, 
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
		
		var arrUserCardsIds = (localStorage.getItem('ST_userCards') == '' ? [] : localStorage.getItem('ST_userCards').split(','));

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

			localStorage.setItem('ST_userCards', listSaveCardsIds);

			if (arrSaveCardsIds.length == arrAllCardsIds.length) this.completeCollection();
		}
	},

	reverse : function() {
		
	}
};

$(StrangerCards.main.init);
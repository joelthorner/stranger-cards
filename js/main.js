const DEFAULT_N_CARDS = 1;

ST.manageData = {
	init : function() {
		this.initStorage();
	},

	initStorage : function() {

		// fill emptys or news or not found data
		localforage.getItem('ST_userCards').then(function(result) {
			var userCards = {};
			// demo test
			result = {
				11 : 1,
				3 : 1, 
				23 : 2, 
				66 : 20
			};
			// end demo test

			if (!result) {
				$.each(ST.cards, function(num, card) {
					userCards[num] = DEFAULT_N_CARDS;
				});
			}else{
				$.each(ST.cards, function(num, card) {
					if (result[num]) {
						userCards[num] = result[num];
					}else{
						userCards[num] = DEFAULT_N_CARDS;
					}
				});
			}
			// save
			localforage.setItem('ST_userCards', userCards);
			// draw
			ST.layout.fillCards(userCards);
		})
	}
}

ST.layout = {
	init : function() {
		// this.fillCards();
	},

	fillCards : function(userCards) {
		var $grid = $('.grid');

		$.each(ST.cards, function(num, card) {
			var num = parseInt(num);
			var numIncr = num + 1;
			
			if (userCards[num]) {
				var cardImage = 'img/cards/' + card.image;
				var imgHtml = `<div class="bg-img" style="background-image: url(${cardImage})"></div>`;
				
				switch(card.type){
					case 1: 
						imgHtml = new Array(6).join(`<div class="bg-img" style="background-image: url(${cardImage})"></div>`);
						break;
					case 3: 
						imgHtml = `<img class="bg-img" src="${cardImage}">`;
						break;
				}

				$grid.append(
					`<figure class="card card-ok card-type-${card.type}" data-num="${num}" id="card-${num}" style="-webkit-box-ordinal-group:${numIncr};-ms-flex-order:${num};order:${num}">
						<div class="inset">
							<span class="number"><i>${num}</i></span>
							<div class="bg">
								${imgHtml}
							</div>
							<div class="caption">
								<b class="title" data-text="${card.name}">${card.name}</b>
								<span class="location">${card.location}</span>
								<span class="episode">${card.episode}</span>
							</div>
						</div>
					</figure>`
				);
			}else{
				$grid.append(
					`<figure class="card card-empty" id="card-container-${num}" style="-webkit-box-ordinal-group:${numIncr};-ms-flex-order:${num};order:${num}">
						<div class="inset">
							<div class="logo"></div>
						</div>
					</figure>`
				);
			}
		});
		ST.layout.specialTypes();
	},

	specialTypes : function() {
		
		// $('.card-type-1 .bg-img').addClass('glitch');
	}
};

ST.main = {
	init : function () {
		ST.manageData.init();
		ST.layout.init();
	}
};

$(ST.main.init);
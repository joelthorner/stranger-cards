// var StrangerCards = {};

// StrangerCards.core = {
// 	init : function () {
// 		StrangerCards.cards.init();
// 	}
// };

// StrangerCards.data = {
// 	11 : {
// 		name : 'Eleven',
// 		image : 'https://vignette.wikia.nocookie.net/strangerthings8338/images/b/b0/ST2-Final_poster.jpg/revision/latest?cb=20171022194958',
// 		text : 'Lorem ipsum dolor sit amet'
// 	}
// };

// StrangerCards.cards = {
// 	template : 
// 		// `<div class="card-wrap">
// 		// 	<div class="card" style="transform: rotateY(0deg) rotateX(0deg);">
// 		// 		<div class="card-bg" style="background-image: url('%image%'); transform: translateX(0px) translateY(0px);"></div>
// 		// 		<div class="card-info">
// 		// 			<div class="h1">%name%</div>
// 		// 			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
// 		// 		</div>
// 		// 	</div>
// 		// </div>`,
// 		`<card data-image="%image%">
// 			<div class="h1" slot="header">%name%</div>
// 			<p slot="content">%text%</p>
// 		</card>`,

// 	init : function () {
// 		$.each(StrangerCards.data, function(cardIndex, cardVal) {
// 			var template = StrangerCards.cards.template;

// 			$.each(cardVal, function(dataIndex, dataVal) {
// 				template = template.replace('%' + dataIndex + '%', dataVal)
// 			});

// 			var $template = $(template);

// 			$('#card-container').append($template);
// 		});

		
// 	}
// };


// $(StrangerCards.core.init);

Vue.component('card', {
	template: `
		<div class="card-wrap" @mousemove="handleMouseMove" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="card">
			<div class="card" :style="cardStyle">
				<div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
				<div class="card-info">
					<slot name="header"></slot>
					<slot name="content"></slot>
				</div>
			</div>
		</div>`,
	
	mounted() {
		this.width = this.$refs.card.offsetWidth;
		this.height = this.$refs.card.offsetHeight;
	},

	props: ['dataImage'],
	
	data: () => ({
		width: 0,
		height: 0,
		mouseX: 0,
		mouseY: 0,
		mouseLeaveDelay: null
	}),

	computed: {
		mousePX() {
			return this.mouseX / this.width;
		},
		mousePY() {
			return this.mouseY / this.height;
		},
		cardStyle() {
			const rX = this.mousePX * 30;
			const rY = this.mousePY * -30;
			return {
				transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
			};
		},
		cardBgTransform() {
			const tX = this.mousePX * -40;
			const tY = this.mousePY * -40;
			return {
				transform: `translateX(${tX}px) translateY(${tY}px)`
			}
		},
		cardBgImage() {
			return {
				backgroundImage: `url(${this.dataImage})`
			}
		}
	},
	
	methods: {
		handleMouseMove(e) {
			this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width/2;
			this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height/2;
		},
		handleMouseEnter() {
			clearTimeout(this.mouseLeaveDelay);
		},
		handleMouseLeave() {
			this.mouseLeaveDelay = setTimeout(()=>{
				this.mouseX = 0;
				this.mouseY = 0;
			}, 1000);
		}
	}
});

const app = new Vue({
  el: '#card-container'
});
var StrangerCards = {};

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

Math.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
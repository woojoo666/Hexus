var SUBSCRIPTION_KEY = '3923fb2c84184cbd9a73dbe45fc9d7b7';

$(function() {
	var params = {
		// Request parameters
		"visualFeatures": "Categories",
		"language": "en",
	};
  
	$.ajax({
		url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
		beforeSend: function(xhrObj){
			// Request headers
			xhrObj.setRequestHeader("Content-Type","application/json");
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",SUBSCRIPTION_KEY);
		},
		type: "POST",
		// Request body
		data: {url: 'http://cdn.embed.ly/providers/logos/imgur.png'},
	})
	.done(function(data) {
		alert("success");
		console.log(data);
	})
	.fail(function() {
		alert("error");
	});
});

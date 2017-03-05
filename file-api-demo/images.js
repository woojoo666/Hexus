$(document).ready(function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
		var user_input = document.getElementById('user_value')
		const stopwords = ["a", "or", "and", "the", "in", "of", "on", "with"];
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea.innerHTML = "";

					var img = new Image();
					img.src = reader.result;
					console.log(img.src);
					// Send to server,
					MicrosoftPost("{'url':'https://www.w3schools.com/css/trolltunga.jpg'}")
					// 	console.log(img.src)

					//var blob = b64toBlob(img.src, "image/jpeg");
					// console.log(img.src)
					//MicrosoftPost(img.src);
					fileDisplayArea.appendChild(img);
				}

				reader.readAsDataURL(file);	
			} else {
				fileDisplayArea.innerHTML = "File not supported!";
			}
		});
		function MicrosoftPost(input) {
			console.log(input)
		    var SUBSCRIPTION_KEY = '3923fb2c84184cbd9a73dbe45fc9d7b7';
		    var params = {
		        // Request parameters
		        "visualFeatures": "Categories, Tags, Description",
		        "language": "en",
		    };
		    $.ajax({
		        url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
		        beforeSend: function(xhrObj){
		            // Request headers
		            xhrObj.setRequestHeader("Content-Type","application/json");
		            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
		        },
		        //cache: true,
		        type: "POST",
		        // Request body - Curr just static image
		        data: input,
		        dataType: "json"
		    })
		    .done(function(data) {
		        alert("success");
		        console.log(data);
		        var res = data["description"]["captions"][0]["text"].split(" ")
		        var map = {}
		        for (i = 0; i < res.length; i++) {
		        	if (stopwords.indexOf(res[i]) < 0) {
		        		map[res[i]] = user_input.value; 
		        	}
		        }
		        console.log(map);
		        // Pass Map into Next function 

		    })
		    .fail(function() {
		        alert("error in posting to MS");
		    });
		};
});

// function MicrosoftPost(img) {
// 	console.log(img)
//     var SUBSCRIPTION_KEY = '3923fb2c84184cbd9a73dbe45fc9d7b7';
//     var params = {
//         // Request parameters
//         "visualFeatures": "Categories, Tags, Description",
//         "language": "en",
//     };
//     $.ajax({
//         url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
//         beforeSend: function(xhrObj){
//             // Request headers
//             xhrObj.setRequestHeader("Content-Type","application/json");
//             xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
//         },
//         //cache: true,
//         type: "POST",
//         // Request body - Curr just static image
//         data: img,
//         dataType: "json"
//     })
//     .done(function(data) {
//         alert("success");
//         console.log(data);
//     })
//     .fail(function() {
//         alert("error in posting to MS");
//     });
// };

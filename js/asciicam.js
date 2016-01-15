(function (app) {
	"use strict";
	var cam, intervalId, canvas, canvasCtx, ascii, btnStart, btnStop,
	    loopSpeed = 100,
	    width = 160,
	    height = 120;
	    var charString = "$$$$$$@@@@@@@B%8&WM#ZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^`'........          "
	    var charArray = charString.split("")


    app.init = function () {
		//Get all the page element we need
        cam = document.getElementById('cam');
        ascii = document.getElementById("asciiText");
		canvas = document.createElement("canvas");
		canvasCtx = canvas.getContext("2d");
		btnStart = document.getElementById('startbtn');
        btnStop = document.getElementById('stopbtn');
        
        //Init events
        btnStart.addEventListener('click', app.startCam);
        btnStop.addEventListener('click', app.stopCam);
    };

    app.startCam = function (e) {
		// Get specific vendor methods
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

		// If browser supports user media
		if (navigator.getUserMedia) {
			navigator.getUserMedia({video: true, toString: function () { return "video"; } },
				function successCallback(stream) {
					//if (navigator.getUserMedia === navigator.mozGetUserMedia) {
					//	cam.src = stream;
					//} else {
						cam.src = window.URL.createObjectURL(stream) || stream;
					//}
					cam.play();
					// intervalId = setInterval(app.loop, loopSpeed);
					btnStart.style.display = "none";
					btnStop.style.display = "inline-block";
					app.loop()
				},
				function errorCallback(error) {
					window.alert("An error ocurred getting user media. Code:" + error.code);
				});
		} else {
			//Browser doesn't support user media
			window.alert("Your browser does not support user media");
		}

		e.preventDefault();
    };

    app.stopCam = function (e) {
		clearInterval(intervalId);
		cam.src = "";
		e.preventDefault();
		btnStop.style.display = "none";
		btnStart.style.display = "inline-block";
    };

    app.findCharByColor = function(gray){
    	var index = (charArray.length-1)-Math.floor((gray/255)*charArray.length)
    	var char = charArray[index]
    	return char
    }
    app.loop = function () {
		var r, g, b, gray, pixels, colordata, character,
		    line = "",
            i = 0;
		
		canvasCtx.clearRect(0, 0, width, height);

		canvasCtx.drawImage(cam, 0, 0, width, height);
		
		pixels = canvasCtx.getImageData(0, 0, width, height);
		colordata = pixels.data;
		
		ascii.innerHTML = ''; //clear contents

		for (i = 0; i < colordata.length; i = i + 4) {
			r = colordata[i];
			g = colordata[i + 1];
			b = colordata[i + 2];
			//converting the pixel into grayscale
			gray = r * 0.2126 + g * 0.7152 + b * 0.0722;
			character = app.findCharByColor(gray)

			if (i !== 0 && (i / 4) % width === 0) {//if the pointer reaches end of pixel-line
				ascii.appendChild(document.createTextNode(line));
				ascii.appendChild(document.createElement("br"));
				line = "";
			}
			
			line += character;
		}
		window.requestAnimationFrame(app.loop)
    };
    
    app.init();

}(window.asciicam = window.asciicam || {}));

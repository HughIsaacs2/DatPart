    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputData = document.getElementById("outputData");

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });

    function tick() {
      loadingMessage.innerText = "⌛ Loading video..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height);
		
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          outputMessage.hidden = true;
          outputData.parentElement.hidden = false;
          outputData.innerText = code.data;
		  if (code.data.substring(0, 6) == "dat://"){
			window.location.hash = "dat="+code.data;
			document.getElementById("output-datlink").href = code.data;
			document.getElementById("output-datlink").title = code.data;
			document.getElementById("output-datlink").hidden = false;
			document.getElementById("output-qrlink").href = "/qr_generator.html?link=" + code.data;
			document.getElementById("output-qrlink").hidden = false;
			document.getElementById("output-link").href = "/redirector.html?link="+code.data;
			document.getElementById("output-link").hidden = false;
		  } else if (code.data.substring(0, 7) == "http://" || code.data.substring(0, 8) == "https://" || code.data.substring(0, 7) == "magnet:") {
			document.getElementById("output-link").href = code.data;
			document.getElementById("output-link").hidden = false;
			document.getElementById("output-datlink").hidden = true;
			document.getElementById("output-qrlink").href = "/qr_generator.html?link=" + code.data;
			document.getElementById("output-qrlink").hidden = false;
		  }
        } else {
          //outputMessage.hidden = false;
          //outputData.parentElement.hidden = true;
        }
      }
      requestAnimationFrame(tick);
    }
	
	document.getElementById("version-notice").textContent="This is version "+chrome.runtime.getManifest().version+" of  "+chrome.runtime.getManifest().short_name+".";
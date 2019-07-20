// autosize height;
var set = function () {
	var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
	var topOffset = 70;
	height = height - topOffset;
	if (height < 1) height = 1;
	if (height > topOffset) {
			$(".page-wrapper").css("min-height", (height) + "px");
	}
};
$(window).ready(set);
$(window).on("resize", set);

// get data about fissures
function getFissuresInfo() {
	timeUpdate = 54000;
	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function(){
		if (xml.readyState == 4 && xml.status == 200) {
			var obj = JSON.parse(xml.responseText);
			var ojbFissuresTier = document.getElementsByClassName("fissure-tier");
			console.clear();
			Array.from(ojbFissuresTier).forEach(el => {
				if ($(el).children().length > 0) {
					$(el).empty();
				} 
			});
			obj.forEach(element => {
				var parent = document.createElement("div");
				parent.className = "fissure";
				 for (key in element) {
					var notKeyIncludes = ['id', 'activation', 'startString', 'expiry', 'active', 'tierNum', 'expired', 'tier'];
					if (!notKeyIncludes.includes(key)) {
						var child = document.createElement("span");
						child.className = "fissure-item";
						if (key == 'eta') {
							var time = element.startString.substring(1, element.startString.length);
							var newTime = time.split(" ");
							var timeDiff = 0;
							for (let i = 0; i < newTime.length; i++) {
								var ch = newTime[i].substring(newTime[i].length, newTime[i].length - 1);
								var n = parseInt(newTime[i].substring(0, newTime[i].length - 1));
								timeDiff += ((ch == 'h')?n *= 3600:0) + ((ch == 'm')?n *= 60:0) + ((ch == 's')?n:0);
							}

							var timer = new easytimer.Timer();
							var activation = Date.parse(element.activation);
							var expiry = Date.parse(element.expiry);
							var dateiff = Math.floor(((parseInt(expiry) - parseInt(activation)) / 1000) - timeDiff);

							timer.start({countdown: true, startValues: {seconds: dateiff}});
							timer.addEventListener('secondsUpdated', function (e) {	
								child.classList.add("badge");
								child.classList.add("badge-primary");	
								child.innerHTML = 'updating';
								child.innerHTML = ((timer.getTimeValues().hours > 0)?timer.getTimeValues().hours.toString() + "h ":'') + ((timer.getTimeValues().minutes > 0)?timer.getTimeValues().minutes.toString() + "m ":'') + ((timer.getTimeValues().seconds > 0)?timer.getTimeValues().seconds.toString() + "s":'');
								if (child.innerHTML == null) {
									child.classList.remove("badge-primary");
									child.classList.add("badge-danger");
									child.innerHTML = "expired";
								}
							});
						} else {
							child.innerHTML = element[key];
						}
						parent.appendChild(child);
					}
					document.getElementById(element.tier).appendChild(parent);
				}
			});
		}
	}
	xml.open("GET", "https://api.warframestat.us/pc/fissures", true);
	xml.send();
}

var timeUpdate = 54000; // time to update info
$(window).ready(getFissuresInfo);
setInterval(function(){
	getFissuresInfo();
}, timeUpdate);
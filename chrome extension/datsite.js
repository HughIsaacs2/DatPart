var DatPart = true;

Array.from(document.querySelectorAll('a[href^="dat://"]:not(a[href*="."])')).forEach(function(link){
    var theLink = link.href;
	link.href = "web+" + theLink;
});
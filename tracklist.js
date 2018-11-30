// tracklist.js
// Music download manager -- Smalltalk style :)
// AJ 2007-04-30
// Requires jQuery 1.1.2

Array.prototype.each = function (fn) { $.each(this, fn); }

var DDA = {
	site: "https://drdraardvark.glitch.me/",
	path: "https://drdraardvark.glitch.me/",
  mp3dir: "https://s3-ap-southeast-2.amazonaws.com/alphajuliet-s3-mp3/drdraardvark/",
	sets: [
			{
				artist: "dr dr aardvark",
				title: "2009",
				tracks: ["Telekom"]
			},
			{
				artist: "dr dr aardvark",
				title: "Myriad (2008)",
				artwork: "https://cdn.glitch.com/c728b17d-e72c-4628-8b4d-5b042768dfbf%2Fmyriad.jpg?1543575269355",
				tracks: ["Aerosol", "Biollay", "Barberaz", "ToolsForSuccess", "Cognin", "Prime", "Nickel", "Mold", "Thorium", "P-N", "LongDistance"]
			},
			{
				artist: "dr dr aardvark",
				title: "Particles (2007)",
				artwork: "https://cdn.glitch.com/c728b17d-e72c-4628-8b4d-5b042768dfbf%2Fparticles.jpg?1543575268205",
				metadata: "data/Particles.n3",
				tracks: ["Depart", "Servolex", "Aftos", "Bissy", "Roort", "Potential", "Coumt", "Teld", "Ilmeg", "Argoil", "Coil", "Gament", "Darius", "Aketh"]
			},
			{
				artist: "dr dr aardvark",
				title: "Carousel (2006)",
				artwork: "https://cdn.glitch.com/c728b17d-e72c-4628-8b4d-5b042768dfbf%2Fcarousel.jpg?1543575268750",
				metadata: "data/Carousel.n3",
				tracks: ["Stati", "Tiproof", "Strond", "Chilt"]
			},
			{
				artist: "dr dr aardvark",
				title: "Derivative (1999)",
				artwork: "https://cdn.glitch.com/c728b17d-e72c-4628-8b4d-5b042768dfbf%2Fderivative.jpg?1543575267436",
				tracks: ["Ascent", "Derivative", "AsianSeas", "Sexkontakt", "Disuse", "PoliceAndThieves", "NakedMile", "Dynix", "Spystar", "Sanctum", "SnowAtEaster"]
			},
			{
				artist: "dr dr aardvark",
				title: "Astralux (1996)",
				artwork: "https://cdn.glitch.com/c728b17d-e72c-4628-8b4d-5b042768dfbf%2Fastralux.jpg?1543575272624",
				tracks: ["FunPark", "Aerobic", "Follicle", "Dustbowl", "Feature", "Shelter", "Puncture", "Beach"]
			},
			{
				artist: "dr dr aardvark",
				title: "Selected (1991-2008)",
				tracks: ["SandDunes", "Delb", "Demons", "Plaster"]
			},
			{
				artist: "Citystate",
				title: "Vault Tracks (1996-2000)",
				tracks: ["Excision", "SystemShock", "LuminousSandsOfTime", "LawnDogs", "Sundial"]
			}
	]
}
// ----------------------------------
// Load the current tracks into the download selector
function loadTracks() {
	var target = $("#tracklist");
	if (!target)
		return;
	target.html("");  	// Remove the no-Javascript text from the XHTML
	
	DDA.sets.each(function (i, set) {
		var album = new Set(set);
		album.attachTo(target);
	});
	
	// Hide all the tracklists initially and set up event handlers
	$("div.set_body").hide();
	$("div.set_header").click(function() {
		$(this).next("div").toggle("slow");
	});
}

// ----------------------------------
// Class: Set
// Make a set of music... Set := {Artist, Title, Artwork?, Metadata?, Track+}
function Set(aSet) {
	
	// Public method
	this.attachTo = function (target) {
		target.append(createHeader(aSet));
		
		var container = $(`<div class="set_body"></div>`);		
		container.append(createArtwork(aSet));

		var tracks = new TrackList(aSet.tracks);
		tracks.attachTo(container);

		container.append(createMetadata(aSet));
		
		target.append(container);
	}

	// private methods
	var createHeader = function (aSet) {
		if (!aSet) return
		var heading = $(`<p>${aSet.artist}: ${aSet.title}</p>`)
		var header = $(`<div class="set_header"></div>`)
    header.append(heading)
		return header;
	}
	
	var createArtwork = function (aSet) {
		if (!aSet) return;
		if (aSet.artwork != null) {
			var artwork = $(`<img src="${aSet.artwork}" alt=${aSet.title} height="150" width="150" class="artwork"/>`);
			return artwork
		}
		else
			return null;
	}
	
	var createMetadata = function (aSet) {
		if (!aSet) return
		if (aSet.metadata != null) {
			var rdf_link = $(`<a href=${aSet.metadata}>[rdf+n3]</a>`)
			var metadata = $(`<p class="small"></p>`)
      metadata.append(rdf_link)
			return metadata
		}
		return null
	}
}

// ----------------------------------
// Class: TrackList
function TrackList(anArray) {
	this.trackNames = anArray || [];
	
	this.attachTo = function (target) {
		var container = $('<ol class="track_list"></ol>')
		this.trackNames.each(function (i, name) {
			var track = new Track(name)
			track.attachTo(container)
		});
		target.append(container);
	}
}

// ----------------------------------
// Class: Track
function Track(aName) {
	this.name = aName || "untitled";

	this.attachTo = function (target) {
		var trackUrl = `${DDA.mp3dir}${this.name}.mp3`;
		var a = $(`<a href="${trackUrl}" target="_blank">${this.name}</a>`);

		var img = $(`<img style="border:0; vertical-align: middle;" title="play-button" src="http://googlepage.googlepages.com/play.gif/>`)
		var player = $(`<a href="${trackUrl}"></a>`)
    player.append(img)
		var container = $('<li></li>')
    container.append(a)
		target.append(container);
	}
}


// ----------------------------------
// Run on document load
$(loadTracks);

// The End

$(document).ready(function(){Path.listen();});

Path.map("#!/dashboard").enter(function(){
	// if($('#container').hasClass('loaded')){
	// 	App.resetView();	
	// }else{
	// 	App.init();
	// }
	App.resetView();
}).to(function(){
    App.dashboardView();
});

Path.map("#!/about").enter(function(){
	// if($('#container').hasClass('loaded')){
	// 	App.resetView();	
	// }else{
	// 	App.init();
	// }
	App.resetView();
}).to(function(){
    App.aboutView();
});

Path.map("#!(/:paramOne)").enter(function(){
	// if($('#container').hasClass('loaded')){
	// 	App.resetView();	
	// }else{
	// 	App.init();
	// }
	App.resetView();
}).to(function(){
    if(this.params['paramOne']){
    	if(this.params['paramOne'] != 'dashboard')
    	App.loadSomething(this.params['paramOne']);
    }else{}
});

// Set Root URL
Path.root("#!/channel1");

//Set 404
Path.rescue(function(){
    window.location = '#!/channel1'
});

// Main Application
var times = [];
var App = {
	init: function(){
// 		var that = this;
		
// 		//Load All Assets (not necessary for dev):
// 		var startPreload = function(manifest){
// 		    preload = new createjs.LoadQueue(true);
// 		    preload.on("progress", that.handleFileProgress);
// 		    preload.on("complete", that.loadComplete);
// 		    preload.on("error", that.loadError);
// 		    preload.loadManifest(manifest);
// 		};
// 		var loadError = function(evt){
// 			console.log("Error!",evt.text);
// 		};
// 		var handleFileProgress = function(event){
// 		    var rawVal = (preload.progress*100|0);
// 		    var loadText = (preload.progress*100|0) + "%";
// 		    var remaining = Math.abs(rawVal*0.4);
// 		    //console.log(rawVal);
// 		};
// 		var loadComplete = function(event){
// 			//Show Home View
// 			$('#container').attr('class', 'loaded');
// 			App.resetView();
// 		};
// 		var setupManifest = function(){
// 		    manifest =[
// {src:"context-five-ballymurphy.jpg"},{src:"context-four-bloodysunday.jpg"},{src:"context-one-north-1968.jpg"},{src:"context-three-duplock.jpg"},{src:"context-two-internment.jpg"},{src:"eye.png"},{src:"gif-ballymurphy-channel.gif"},{src:"gif-dealing-with-past-channel.gif"},{src:"gif-plastic-bullets-channel.gif"},{src:"gif-security-forces-channel.gif"},{src:"gif-shankill-bomb-channel.gif"},{src:"title.png"},{src:"tv.png"},{src:"ScSh01.jpg"},{src:"ScSh02.jpg"},{src:"ScSh03.jpg"},{src:"ScSh04.jpg"},{src:"ScSh05.jpg"},{src:"ScSh06.jpg"},{src:"ScSh07.jpg"},{src:"ScSh08.jpg"},{src:"ScSh09.jpg"},{src:"ScSh10.jpg"},{src:"ScSh11.jpg"},{src:"ScSh12.jpg"},{src:"ScSh13.jpg"},{src:"ScSh14.jpg"},{src:"ScSh15.jpg"},{src:"ScSh16.jpg"},{src:"ScSh17.jpg"},{src:"ScSh18.jpg"},{src:"ScSh19.jpg"},{src:"ScSh20.jpg"},{src:"ScSh21.jpg"},{src:"ScSh22.jpg"},{src:"ScSh23.jpg"},{src:"ScSh24.jpg"},{src:"ScSh25.jpg"},{src:"ScSh26.jpg"},{src:"ScSh27.jpg"},{src:"ScSh28.jpg"},{src:"ScSh29.jpg"},{src:"ScSh30.jpg"},{src:"ScSh31.jpg"},{src:"ScSh32.jpg"},{src:"ScSh33.jpg"},{src:"ScSh34.jpg"},{src:"ScSh35.jpg"},{src:"ScSh36.jpg"},{src:"ScSh37.jpg"},{src:"ScSh38.jpg"},{src:"ScSh39.jpg"},{src:"ScSh40.jpg"},{src:"ScSh41.jpg"},{src:"ScSh42.jpg"},{src:"ScSh43.jpg"},{src:"ScSh44.jpg"},{src:"ScSh45.jpg"},{src:"ScSh46.jpg"},{src:"ScSh47.jpg"},{src:"ScSh48.jpg"},{src:"ScSh49.jpg"},{src:"ScSh50.jpg"},{src:"ScSh51.jpg"},{src:"ScSh52.jpg"},{src:"ScSh53.jpg"},{src:"ScSh54.jpg"},{src:"ScSh55.jpg"},{src:"ScSh56.jpg"},{src:"ScSh57.jpg"},{src:"ScSh58.jpg"},{src:"ScSh60.jpg"},{src:"ScSh61.jpg"},{src:"ScSh62.jpg"}
// 		    ];
// 		    startPreload(manifest);
// 		};
// 		setupManifest();
	},
	loadSomething: function(data){
		var that = this;
		data = eval(data); 

		$.get('tmp/video.mst', function(template) {
	    	var rendered = Mustache.render(template, data);
	    	console.log(data);
	    	$('#player').html(rendered);
	  	}).done(function(){
	  		//When data is loaded show it
	  		that.videoView();
	  	});
	},
	ui: function(){
		var that = this;
		$('#nav-toggle').on('click',function(){
			$(this).toggleClass('active');
			$('nav#main').toggleClass('active');
		});
		$('nav#main ul li a').on('click',function(){
			$('nav#main').removeClass('active');
			$('#nav-toggle').removeClass('active');
		});
		$('#a.dash').on('click', function(){
			$('div.card').addClass('flipped');
			console.log(URL);
		});
		$('#a.tv').on('click', function(){
			$('div.card').removeClass('flipped');
			console.log(URL);
		});
		$('div.tray-grip').on('click', function(){
			console.log('click');
			if ($('#channel-guide').hasClass('open')) {
				that.vidPlay();
				$('#channel-guide').removeClass('open');
				console.log('open');
			}
			else if(! $('#channel-guide').hasClass('open')){
				that.vidPause();
				$('#channel-guide').addClass('open');
				console.log('closed');
			}
		});
		$('.guide-link').on('click', function(){
			$('#channel-guide').removeClass('open');
		});
		
		$('ul.chapters li.flag').on('click', function(){
			var flagNum = $(this).attr('data-flag');
			$('div.context.'+flagNum).addClass('on');
			that.vidPause();
		});
		$('.xout').on('click', function(){
			$('div.context').removeClass('on');
			that.vidPlay();
		});
		$('.xout.about').on('click',function(){
			$('div#about').removeClass('on');
			window.location = '#!/channel1';
		});
		$('img.desaturate').on('click', function(){
			window.location = '#!/channel1';
		});
	},
	mobileCheck: function(){
		var isMobile = window.matchMedia("only screen and (max-width: 760px)");
		$(window).resize(function(){
			if( isMobile.matches) {console.log('this is a narrow screen');}
			else{console.log('this is a wide screen');}
		});
		$(window).resize();
	},
	exitView: function(){},
	loadingView: function(){},
	resetView: function(){
		$('div.subView').removeClass('on');
		$('#nav-toggle').off();
		$('#a.dash').off();
		$('#a.tv').off();
		$('div.tray-grip').off();
		$('.guide-link').off();
		$('ul.chapters li.flag').off();
		$('.xout').off();
		$('.xout.about').off();
		$('img.desaturate').off();
	},
	aboutView: function(){
		$('div#about').addClass('on');
		this.ui();
	},
	videoView: function(){
		$('div#videos').addClass('on');
		this.vidStart();
		this.ui();
		$('div.card').removeClass('flipped');
	},
	dashboardView: function(){
		this.vidPause();
		this.ui();
		if(!$('div.card').hasClass('flipped')){
			$('div.card').addClass('flipped');
		}else{}
		//$('#toggle-link').attr('href', '#!/channel1');
	},
	aboutView: function(){
		$('div#about').addClass('on');
		this.vidPause();
		this.ui();
	},
	vidStart: function(){

		var iframe = $('#player1')[0];
		var player = $f(iframe);
		var status = $('.status');
		var dur; 
		var that = this;
		
		// When the player is ready, add listeners for pause, finish, and playProgress
		player.addEvent('ready', function() {
			setChapters();
		    status.text('ready');
		    player.addEvent('pause', that.vidPause);
		    //player.addEvent('finish', onFinish);
		    player.addEvent('playProgress', that.vidProgress);
		    player.api('play');
    
		});

		function setChapters(){

			player.api('getDuration', function(dur) {
				$('ul.chapters li').each(function(){
					var time = $(this).attr('data-timestamp');
					var chapPos = (time/dur) * 100;
					times.push(chapPos); 
				});
			}); 
		}
	},
	vidPause: function(){
		var iframe = $('#player1')[0];
		var player = $f(iframe);
		var status = $('.status');
		var dur; 

		player.api('pause');
		//$('div.context').addClass('on');
	},
	vidPlay: function(){
		var iframe = $('#player1')[0];
		var player = $f(iframe);
		var status = $('.status');
		var dur; 
		player.api('play');
	},
	vidProgress: function(data, id){
		var iframe = $('#player1')[0];
		var player = $f(iframe);
		var status = $('.status');
		var dur; 

		var progressBar;
		var count = data.seconds;
		var playSwitch = true;
		console.log(count);

	    status.text(data.seconds + 's played');
		player.api('getDuration', function(dur) {

			var progressBar = (data.seconds/dur) *100;
			$('div.progress-bar').css('width',progressBar + '%');
		 
			var timePad = 0.05;
			var flagOne = times[0];
			var flagTwo = times[1];
			var flagThree = times[2];
			var flagFour = times[3];
			var flagFive = times[4];

			var flagOneAfter = times[0]+timePad;
			var flagTwoAfter = times[1]+timePad;
			var flagThreeAfter = times[2]+timePad;
			var flagFourAfter = times[3]+timePad;
			var flagFiveAfter = times[4]+timePad;

			var flagOneBefore = times[0]-timePad;
			var flagTwoBefore = times[1]-timePad;
			var flagThreeBefore = times[2]-timePad;
			var flagFourBefore = times[3]-timePad;
			var flagFiveBefore = times[4]-timePad;

			if (progressBar >= flagOneBefore && progressBar <= flagOneAfter){
				// console.log('in region 1');
				// console.log('progressBar: '+progressBar);
				// console.log('This Flag Range: '+flagOneBefore+' '+flagOneAfter);
				$('li.flag').removeClass('on');
				$('li.flag.one').addClass('on');
				$('.lower-3rd div.background').addClass('on');

				setTimeout(function(){
					$('li.flag.one').removeClass('on');
					$('.lower-3rd div.background').removeClass('on');
				}, 6000);

			}
			else if (progressBar >= flagTwoBefore && progressBar <= flagTwoAfter){
				// console.log('In region 2');
				// console.log('progressBar: '+progressBar);
				// console.log('This Flag Range: '+flagTwoBefore+' '+flagTwoAfter);
				$('li.flag').removeClass('on');
				$('li.flag.two').addClass('on');
				$('.lower-3rd div.background').addClass('on');
				setTimeout(function(){
					$('li.flag.two').removeClass('on');
					$('.lower-3rd div.background').removeClass('on');
				}, 6000);
			}
			else if (progressBar >= flagThreeBefore && progressBar <= flagThreeAfter){
				//console.log('in region 3');
				$('li.flag').removeClass('on');
				$('li.flag.three').addClass('on');
				$('.lower-3rd div.background').addClass('on');
				setTimeout(function(){
					$('li.flag.three').removeClass('on');
					$('.lower-3rd div.background').removeClass('on');
				}, 6000);
			}
			else if (progressBar >= flagFourBefore && progressBar <= flagFourAfter){
				//console.log('in region 4');
				$('li.flag').removeClass('on');
				$('li.flag.four').addClass('on');
				$('.lower-3rd div.background').addClass('on');
				setTimeout(function(){
					$('li.flag.four').removeClass('on');
					$('.lower-3rd div.background').removeClass('on');
				}, 6000);
			}
			else if (progressBar >= flagFiveBefore && progressBar <= flagFiveAfter){
				//console.log('in region 5');
				$('li.flag').removeClass('on');
				$('li.flag.five').addClass('on');
				$('.lower-3rd div.background').addClass('on');
				setTimeout(function(){
					$('li.flag.five').removeClass('on');
					$('.lower-3rd div.background').removeClass('on');
				}, 6000);
			}
		});
	},
};  

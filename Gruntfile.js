
module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			dist: {
				options: {
					sassDir:'style/',
					cssDir: 'style/css'
				}
			}
		},
		watch:{
			//css: {
				files: ['style/*.scss', '*.html','projects/*.html', 'js/*.js'],
				tasks : ['compass'],
				options: {
					livereload: true
				}
			//}
		},
		connect: {
		    server: {
				options: {
					port: 9000,
					hostname: "0.0.0.0",
					base: '',
					// Change this to '0.0.0.0' to access the server from outside.
					//keepalive: true
					livereload: true
				}
		    }
		},
		open: {
			all: {
				path: 'http://localhost:<%= connect.server.options.port%>'
			}
		},
		imagemin: {                                // Task
			dynamic: {                             // Another target
				files: [{
					expand: true,                  // Enable dynamic expansion
					cwd: 'img/',                   // Src matches are relative to this path
					src: ['*.{png,jpg,gif}'],      // Actual patterns to match
					dest: 'dist/img'               // Destination path prefix
				}]
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'style/css',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/style/css',
					ext: '.min.css'
				}]
			}
		},
		uglify: {
			my_target: {
				files: {
					'dist/js/app.min.js': ['node_modules/jquery/dist/jquery.min.js', 
					'js/libs/preloadjs-0.6.0.min.js',
					'node_modules/vimeo-froogaloop/froogaloop.min.js', 
					'js/libs/path.min.js',
					'node_modules/mustache/mustache.min.js', 
					'js/app.js']
				}
			}
		},
		htmlmin: {                                     
			dist: {                                      
			  options: {                                
			    removeComments: true,
			    collapseWhitespace: true
			  },
			  files: {                                   
			    'dist/index.html': 'index.html'     
			  }
			}
		}
	});

	//Watch for Development:
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('server',['connect', 'open', 'watch']);

	//Build for Production:
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.registerTask('build',['imagemin','cssmin', 'uglify', 'htmlmin']);
}
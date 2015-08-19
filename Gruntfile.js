
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
					'dist/js/app.min.js': 
					[
						'node_modules/jquery/dist/jquery.min.js', 
						'js/libs/preloadjs-0.6.0.min.js',
						'js/libs/path.min.js',
						'node_modules/mustache/mustache.min.js',
						'js/libs/froogaloop.js', 
						'js/data-vis.js', 
						'js/data/data.js',
						'js/app.js'
					]
				}
			}
		},
		jsonmin: {
			dev: {
				options: {
					stripWhitespace: true,
					stripComments: true
				},
				files: {
					'dist/trimmed_georef.json':'trimmed_georef.json',
					'dist/thumbnails.json':'thumbnails.json'
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
					//'dist/tmp/video.mst':'tmp/video.mst'     
				}
			}
		},
		copy: {
			main: {
				files: [
					// includes files within path 
					{expand: true, src: ['tmp/*'], dest: 'dist'},
					{expand: true, src: ['img/**'], dest: 'dist'}
				]
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
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsonmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('build',['cssmin', 'uglify', 'jsonmin', 'htmlmin', 'copy']);
}
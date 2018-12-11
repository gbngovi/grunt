module.exports = function (grunt) {
    grunt.initConfig({
        "merge-json": {
            "dt": {
                src: [ "manifest/list_dt.json" ],
                dest: "manifest/list_combined.json"
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        scriptsPath: grunt.file.readJSON('manifest.json'),
        name: "game",
        jsDir: '<%= scriptsPath.sourcePath %><%= scriptsPath.jsPath %>',
        assetsDir: '<%= scriptsPath.sourcePath %><%= scriptsPath.assetsPath %>',
        imagesDir: '<%= scriptsPath.imagesPath %>',
        imagesDesDir: '<%= scriptsPath.buildPath %><%= scriptsPath.assetsPath %><%= scriptsPath.imagesPath %>',
        lessDir: '<%= scriptsPath.sourcePath %><%= scriptsPath.lessPath %>',
        jsDestDir: "<%= scriptsPath.buildPath %><%= scriptsPath.jsPath %>",
        cssDir: "<%= scriptsPath.buildPath %><%= scriptsPath.cssPath %>",
        assetDestDir: "<%= scriptsPath.buildPath %><%= scriptsPath.assetsPath %>",
        fileindex: {
            list: {
                options: {
                    format: 'json_flat',
                    pretty: true
                },
                files: [
                    {dest: '<%= assetsDir %>manifest/list_dt.json', src: ['images/dt/**/*.png','images/dt/**/*.jpg','images/generic/dt/**/*.png','images/generic/dt/**/*.jpg','manifest/dt/**/*.json','manifest/dt/**/*.xml','images/common/**/*.png','images/common/**/*.jpg'],cwd: '<%= assetDestDir %>'},
                ]
            }
        },
        listManifest: {
            json: {
                options: {
                    pretty: false
                },
                files: [
                    {dest: '<%= assetDestDir %>manifest/list_dt.json', src: '<%= assetsDir %>manifest/list_dt.json'},
                ]
            }

        },
        updateGameDebug:{
            debug:{
                options:{
                    debug:true
                },
                files: [{
                    dest: '<%= scriptsPath.buildPath %>index.html',
                    src: '<%= scriptsPath.sourcePath %>index.html'
                }]
            },
            build:{
                options:{
                    debug:false
                },
                files: [{
                    dest: '<%= scriptsPath.buildPath %>index.html',
                    src: '<%= scriptsPath.sourcePath %>index.html'
                }]
            }
        },
        concat: {
          options: {
              separator: "\n",
              expand: true,
              nonull: true,
              stripBanners: true
              //banner:'\"use strict\"\n'
          },
            dist: {
                src: getJsPath(false),
                dest: '<%= jsDestDir %><%=name%>-debug.js'
            }
        },
        uglify: {
          options: {
                  compress: {
                      drop_console: true,
                      dead_code: true
                  },
                  preserveComments: false,
                  quoteStyle: 1,
                  screwIE8: true,
                  sourceMap: false,
                  mangle: true,
                  mangleProperties: true,
                  reserveDOMCache: true
              },
            build: {
                src: '<%= jsDestDir %><%=name%>-debug.js',
                dest: '<%= jsDestDir %><%=name%>-min.js'
            }
        },
        less: {
          development: {
            files: {
                "<%= cssDir %>dt/main.css": "<%= lessDir %>/dt/main.less",
                "<%= cssDir %>dt/odometer-theme-default.css": "<%= lessDir %>/dt/odometer-theme-default.less",
            }
            },
            production: {
                options: {
                    paths: ["css"],
                    compress: true,
                    cleancss: true,
                    modifyvars: {
                        imgPath: '"<%= scriptsPath.buildPath %>"/'
                    }
                },
                files: {
                    "<%= cssDir %>dt/main.css": "<%= lessDir %>/dt/main.less",
                    "<%= cssDir %>dt/odometer-theme-default.css": "<%= lessDir %>/dt/odometer-theme-default.less",
                }
            }
        },
        imagemin: {
			static: {
               options:{
				  optimizationLevel: 7
			   },
                files: [{
                    expand: true,
                    cwd: '<%= scriptsPath.sourcePath %>/res/images/',
                    src: ['**/*.{png,jpg}'],
                    dest: '<%= scriptsPath.buildPath %>/res/images/'
                },
                    {
                        expand: true,
                        cwd: '<%= scriptsPath.sourcePath %>/res/images',
                        src: ['**/*.{png,jpg}'],
                        dest: '<%= scriptsPath.buildPath %>/res/images'
                    }]
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= scriptsPath.sourcePath %>/res/images',
                    src: ['**/*.{png,jpg}'],
                    dest: '<%= scriptsPath.buildPath %>/res/images'
                },
                    {
                    expand: true,
                    cwd: '<%= scriptsPath.sourcePath %>/images',
                    src: ['**/*.{png,jpg}'],
                    dest: '<%= scriptsPath.buildPath %>/images'
                }]
            }
        },
        clean: {
            options:{
                force:true
            },
            build: ["<%= scriptsPath.buildPath %>"],
            js: ['<%= jsDestDir %><%=name%>-debug.js']
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: '<%= assetsDir %>manifest/', src: ['**'], dest: '<%= assetDestDir %>manifest/'},
                    {expand: true, cwd: '<%= assetsDir %>lang/', src: ['**'], dest: '<%= assetDestDir %>lang/'},
                    {expand: true, cwd: '<%= assetsDir %>Audio/', src: ['**'], dest: '<%= assetDestDir %>Audio/'},
                    {expand: true, cwd: '<%= assetsDir %>font/', src: ['**'], dest: '<%= assetDestDir %>font/'},
                    {expand: true, cwd: '<%= scriptsPath.sourcePath %>images/', src: ['**'], dest: '<%= scriptsPath.buildPath %>images/'},
                    {
                        expand: true,
                        cwd: '<%= scriptsPath.sourcePath %>',
                        src: ['*.html'],
                        dest: '<%= scriptsPath.buildPath %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= scriptsPath.sourcePath %>',
                        src: ['*.js'],
                        dest: '<%= scriptsPath.buildPath %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= scriptsPath.sourcePath %>',
                        src: ['*.json'],
                        dest: '<%= scriptsPath.buildPath %>'
                    }
                ]
            }
        },
        express: {
            options: {
                background: true
            },
            dev: {
                options: {
                    script: 'node_modules/http-server/bin/http-server',
                    args: ["<%= scriptsPath.buildPath %>"],
                    port: 8089
                }
            }
        },
        watch: {
            options: {
                atBegin: true,
                livereload: false,
                event: ['all']
            },
            scripts: {
                files: ['<%= jsDir %>**', 'manifest.json'],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            },
            copy: {
                files: ['<%= assetsDir %>/**','<%= assetsDir %>/manifest/**', '<%= scriptsPath.sourcePath %>*.html'],
                tasks: ['copy','listManifest','updateGameDebug:debug']
            },
            css: {
                files: ['<%= lessDir %>**'],
                tasks: ['less:development']
            },
            images: {
                files: ['<%= assetsDir %>/images/**'],
                tasks: ['newer:imagemin:dynamic', 'fileindex','listManifest']
            },
            express: {
                files: ['js/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        }
    });
    function getJsPath(build) {
      var wholeFile = grunt.file.readJSON('manifest.json'),
          jsDir = wholeFile.sourcePath + wholeFile.jsPath, i;
      for (i in wholeFile.jsFiles) {
          wholeFile.jsFiles[i] = jsDir + wholeFile.jsFiles[i];
      }
      for (i  in wholeFile.lib) {
          wholeFile.lib[i] = jsDir + "lib/" + wholeFile.lib[i];
      }
      if (build) {
          wholeFile.lib.push(jsDir + "lib/IME-min.js");
      } else {
          wholeFile.lib.push(jsDir + "lib/IME-debug.js");
      }
      // console.log(arguments);
      return wholeFile.lib.concat(wholeFile.jsFiles);
    }
    grunt.registerMultiTask('updateGameDebug', function () {
        var options = this.options({
            debug:true
        }),
            file = grunt.file.read(this.files[0].src);
        //grunt.log.writeln(this.target + ': ' ,this.options," :-> ");
        if(!options.debug){
            file = file.replace('js/game-debug.js','js/game-min.js');
            //grunt.log.writeln(this.target + ': ' +options.debug+":-> " +file);
        }
        grunt.file.write(this.files[0].dest, file);
    });
    grunt.registerMultiTask('listManifest', function () {
      var path = require("path");
        var options = this.options({
            pretty :true
        });
        grunt.log.writeln(this.target + ': ' + JSON.stringify(this.files[0].src));
        var i, j, list, listTOBe, match,ext,type;
        for(i = 0; i < this.files.length; i++) {
            list = grunt.file.readJSON(this.files[i].src);

            listTOBe = [];
            for (j = 0; j < list.length; j++) {
                // console.log(list[j]+".............");
                // console.log(list[j].match(/[a-z,0-9,_,\-,\s]+(\.)/ig));
                ext = path.extname(list[j]);
                type = null;
                switch(ext){
                    case '.jpg':
                    case '.png':
                        type= "image";
                        break;
                    case '.css':
                        type= "css";
                        break;
                    case '.json':
                        type="json";
                        break;

                }
                match = list[j].match(/[a-z,0-9,_,\-,\s]+(\.)/ig)[0];
                listTOBe.push({
                    id: match.substr(0, match.length - 1),
                    src: list[j]
                });

            }
            var jsonFinale = {};
            jsonFinale["manifest"] = listTOBe;
            jsonFinale["basePath"] = "res/";
            jsonFinale["xhr"] = false;
            grunt.file.write(this.files[i].dest, JSON.stringify(jsonFinale, null, 4));
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('list', ['listManifest']);
    grunt.registerTask('debug', ['clean:build', 'imagemin:dynamic', 'copy', 'updateGameDebug:debug','less', 'fileindex', 'listManifest', 'concat']);
    grunt.registerTask('copyImages' ,['imagemin:static']);
    grunt.registerTask('build', ['clean:build', 'imagemin:static', 'copy', 'updateGameDebug:build', 'less:production', 'concat', 'fileindex', 'listManifest', 'uglify', 'clean:js']);
};

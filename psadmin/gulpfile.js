"use strict";


const browserify = require("browserify"); // Bundles JS
const concat = require("gulp-concat"); // Concatenates files
const connect = require("gulp-connect"); // Runs local dev server
const eslint = require("gulp-eslint"); // Lint JS files, including JSX
const gulp = require("gulp");
const open = require("gulp-open"); // Open a URL in web browser
const path = require("path");
const reactify = require("reactify"); // Transpile React JSX to JS
const source = require("vinyl-source-stream"); // Ue conventional text streams with Gulp

const config = {
  port: process.env.C9_PORT || 8080,
  devBaseUrl: process.env.C9_HOSTNAME || "0.0.0.0",
  paths: {
    bootstrap: path.resolve(__dirname, "node_modules/bootstrap/dist/css"),
    dist: path.resolve(__dirname, "dist"),
    html: path.resolve(__dirname, "src/*.html"),
    js: path.resolve(__dirname, "src/**/*.js"),
    mainJS: path.resolve(__dirname, "src/main.js"),
  }
};

config.paths.css = [
  path.resolve(config.paths.bootstrap, "bootstrap.min.css"),
  path.resolve(config.paths.bootstrap, "bootstrap-theme.min.css"),
];

console.log("CSS = ", config.paths.css);

// conect process
// Start a local development server
gulp.task("connect", () => {
  connect.server({
    root: [config.paths.dist],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true,
  });
});

// open process
gulp.task("open", ["connect"], () => {
  gulp.src(path.resolve(config.paths.dist, "index.html"))
    .pipe(open({uri: `${config.devBaseUrl}:${config.port}/`}
  ));
});

// html process
gulp.task("html", () => {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task("js", () => {
  browserify(config.paths.mainJS)
    .transform(reactify)
    .bundle()
    .on("error", console.error.bind(console))
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(path.resolve(config.paths.dist, "scripts")))
    .pipe(connect.reload());
});

gulp.task("css", () => {
  gulp.src(config.paths.css)
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(path.resolve(config.paths.dist, "css")));
});

gulp.task("lint", () => {
  return gulp.src(config.paths.js)
    .pipe(eslint({config: "eslint.config.json"}))
    .pipe(eslint.format());
});

// whatch process
gulp.task("watch", () => {
  gulp.watch(config.paths.html, ["html"]);
  gulp.watch(config.paths.js, ["js", "lint"]);
});

// default process
gulp.task("default", ["html", "js", "css", "lint", "open", "watch"]);
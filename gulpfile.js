//引入插件
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');//合并文件;

//默认任务
gulp.task('default',['sass','contentjs']);


//common.sass任务
gulp.task('sass',function(){
    gulp.src('js/plungs/filter.scss')
        .pipe( sass()) //该任务调用的模块
        .pipe( rename('demo.css' ))
        .pipe( gulp.dest('css'))

    gulp.watch('js/plungs/filter.scss',['sass']);

})

//合并js任务
gulp.task('contentjs',function(){
    gulp.src(['js/plungs/filter-grade.js','js/plungs/filter-multiple.js','js/plungs/filter-sigle.js','js/plungs/filter-tags.js'] )
        .pipe(concat('filter.js'))
        .pipe(gulp.dest('js/plungs'))

    gulp.watch('js/plungs/*.js',['contentjs']);

})


//引入插件
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    rename = require('gulp-rename');

//默认任务
gulp.task('default',['sass']);


//common.sass任务
gulp.task('sass',function(){
    gulp.src('js/plungs/filter.scss')
        .pipe( sass()) //该任务调用的模块
        .pipe( rename('demo.css' ))
        .pipe( gulp.dest('css'))

    gulp.watch('js/plungs/filter.scss',['sass']);

})

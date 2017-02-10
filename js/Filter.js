/**
 * Created by qinwen on 17/2/10.
 */
/**
 * Created by qinwen on 16/12/8.
 *///
;(function($,window,document,undefined){
    var pluginName = "filter";
    var defaults = {
        callBack:null,
        tabs:[],
        type:"grade",   // grade:阶级型数据
        gradeNum:3 //阶级数目默认3层
    }
    function Plugin(element,options){
        this.element = element;
        this.options = $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function(){
        var self = this;
        self.initTabs().initBind();
        self.initStyle();
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initTabs = function(){

    }

    /**
     * 初始化样式
     */
    Plugin.prototype.initStyle = function(){
        var self = this;
        var tabs = $('.ui-tab-tab').length;
        var wid=document.documentElement.clientWidth / tabs;
        $('.ui-tab-tab').css("width",wid);

        var persent = 100 / $(".screening ul li").length +"%";
        $(".screening ul li")
            .css("width",persent);
    }

    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind=function(){

    }



    $.fn[pluginName] = function(options) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function() {
                if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
                }
            });
            if (returnVal !== undefined) {
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof options === "object" || !options) {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
    };

})(jQuery,window,document);


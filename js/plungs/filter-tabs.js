/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterTabs";
    var defaults = {
        data:[],
        clickHandle:null //点击事件
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
        self.initTabs(self.options.data).initStyle();
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initTabs = function(data){
        var self = this;
        var ul= document.createElement('ul'); //创建评论内容容器
        var i,len;  //优化变量声明
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li'); //删除按钮

            li.setAttribute("data-tab-id",data[i].id || ("tab"+i));
            li.innerHTML=data[i].name;
            self.initBind(li);

            ul.appendChild(li);
        }
        this.element.appendChild(ul);
        return this;
    }

    /**
     * 初始化样式
     */
    Plugin.prototype.initStyle = function(){
        var self = this;
        var width = 100 / $(self.element).find("ul li").length +"%";
        $(self.element).find("ul li")
            .css("width",width);
        return this;
    }

    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content){
        var self = this;
        $(content).on("click", function () {
            $(self.element).find("ul li").removeClass('active');
            $(content).addClass('active');
            self.options.clickHandle && self.options.clickHandle(content.getAttribute("data-tab-id"));
        })
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


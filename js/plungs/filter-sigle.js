/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterSigle";
    var defaults = {
        data:{},
        settingEnable:true, //是否支持自定义
        settingType:"interval", //自定义的样式   interval :选择区间
        settingTip:"区间",
        placeholderLow:"最低区间",
        placeholderHigh:"最高区间",
        sureBtn:"确定",
        clickHandle:null, //点击事件
        comfirm:null
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
        self.initContent(self.options.data);
        self.initStyle();
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initContent = function(data){
        var self = this;

        var ul= document.createElement('ul');
        $(ul).addClass("filter-sigle-content");

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li');

            li.setAttribute("data-tab-id",data[i].key || ("tab"+i));
            li.innerHTML=data[i].desc;

            //绑定点击事件
            self.initBind(li);
            ul.appendChild(li);
        }
        this.element.appendChild(ul);

        return this;
    }

    Plugin.prototype.initStyle = function(){
        var self = this;
        if(!self.options.settingEnable){
            return;
        }
        switch (self.options.settingType){
            case "interval":
                self.intervalStyleInit();
                break;
        }

        var settingContent = self.element.querySelector(".filter-sigle-setting");
        if(self.options.settingEnable && settingContent){
            var height= self.element.querySelector(".filter-sigle-content").offsetHeight;
            $(settingContent).css("top",height+"px")
        }
    }

    /**
     * 选择区间
     */
    Plugin.prototype.intervalStyleInit = function(){
        var self = this;
        var div = document.createElement('div');
        $(div).addClass("filter-sigle-setting");

        var tip = document.createElement('tip');
        tip.innerHTML = self.options.settingTip;
        $(tip).addClass("intervalTip");
        div.appendChild(tip);

        var inputLow =  document.createElement('input');
        inputLow.setAttribute("placeholder",self.options.placeholderLow);
        $(inputLow).addClass("intervalInput");
        $(inputLow).addClass("intervalLow");
        div.appendChild(inputLow);

        var intervalHr =  document.createElement('hr');
        $(intervalHr).addClass("intervalHr");
        div.appendChild(intervalHr);

        var inputHigh =  document.createElement('input');
        inputHigh.setAttribute("placeholder",self.options.placeholderHigh);
        $(inputHigh).addClass("intervalInput");
        $(inputHigh).addClass("intervalHigh");
        div.appendChild(inputHigh);

        var sureBtn =  document.createElement('button');
        sureBtn.innerHTML = self.options.sureBtn;
        $(sureBtn).addClass("intervalSure");
        div.appendChild(sureBtn);

        this.element.appendChild(div);

        $(sureBtn).on("click", function () {
            self.options.comfirm && self.options.comfirm({
                intervalLow:$(inputLow).val(),
                intervalHigh:$(inputHigh).val()
            });
        })
    }

    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content){
        var self = this;
        $(content).on("click", function () {
            $(content).parent().find("li").removeClass('active');
            $(content).addClass('active');
            var key = content.getAttribute("data-tab-id");
            self.options.clickHandle && self.options.clickHandle(key);
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


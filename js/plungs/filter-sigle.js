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
        comfirm:null,
        selected:null //若传回字符串,则为单选,若传回数组,则为自定义
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

            self.options.selected && self.options.selected == data[i].key &&  $(li).addClass("active");

            li.setAttribute("data-tab-id",data[i].key);
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
        inputLow.setAttribute("type","number");
        $(inputLow).addClass("intervalInput");
        $(inputLow).addClass("intervalLow");
        $(inputLow).on("keyup", function () {
            setSureBtn();
        })
        div.appendChild(inputLow);

        var intervalHr =  document.createElement('span');
        $(intervalHr).addClass("intervalHr");
        div.appendChild(intervalHr);

        var inputHigh =  document.createElement('input');
        inputHigh.setAttribute("placeholder",self.options.placeholderHigh);
        inputHigh.setAttribute("type","number");
        $(inputHigh).addClass("intervalInput");
        $(inputHigh).addClass("intervalHigh");
        $(inputHigh).on("keyup", function () {
            setSureBtn();
        })
        div.appendChild(inputHigh);

        var sureBtn =  document.createElement('button');
        sureBtn.innerHTML = self.options.sureBtn;
        sureBtn.setAttribute("disabled","disabled");
        $(sureBtn).addClass("intervalSure");
        div.appendChild(sureBtn);

        this.element.appendChild(div);

        if(self.options.selected instanceof Array){
            $(inputLow).val(self.options.selected[0]);
            $(inputHigh).val(self.options.selected[1]);
            sureBtn.removeAttribute("disabled");
        }

        $(sureBtn).on("click", function () {
            if(!check()){
                alert("区间设置有误!");
                return;
            }
            self.options.comfirm && self.options.comfirm({
                intervalLow:$(inputLow).val(),
                intervalHigh:$(inputHigh).val()
            });
            $('.filter-sigle-content >li').removeClass('active');
        })

        function setSureBtn(){
            if($(inputHigh).val()>0 && $(inputLow).val()>0){
                $(sureBtn).removeAttr("disabled");
            }else {
                sureBtn.setAttribute("disabled","disabled");
            }
        }

        function check(){
            if(Number($(inputHigh).val()) < Number($(inputLow).val())){
                  return false;
            }else {
                return true;
            }
        }
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


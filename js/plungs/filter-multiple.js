/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterMultiple";
    var defaults = {
        data:{},
        sureBtn:"确定",
        comfirm:null,
        selectAllEnable:true,
        selectAllTip:"全部",
        selectAllHandle:null,
        clickHandle:null, //点击事件
        selected:null//选择的
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
        self.initContent(self.options.data).initStyle();

    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initContent = function(data){
        var self = this;

        var ul= document.createElement('ul');
        $(ul).addClass("filter-multiple-content")

        if(self.options.selectAllEnable){
            var li = document.createElement('li');
            $(li).addClass('clickAll');
            $(li).attr('id','clickAll');
            li.innerHTML=self.options.selectAllTip;
            $(li).on("click", function () {
                self.selectAllHandle();
                self.options.selectAllHandle && self.options.selectAllHandle();
            })
            ul.appendChild(li);
        }

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li');
            li.innerHTML=data[i].desc;
            li.setAttribute("data-tab-id",data[i].key);

            var checkbox = document.createElement('span');
            $(checkbox).addClass("multiple-checkbox");
            li.appendChild(checkbox);

            if(self.options.selected && self.options.selected.indexOf(data[i].key,0) != -1){
                $(li).addClass('active');
            }

            //绑定点击事件
            self.initBind(li);
            ul.appendChild(li);
        }

        this.element.appendChild(ul);

        var div = document.createElement('div');
        $(div).addClass("filter-multiple-setting");

        var sureBtn =  document.createElement('button');
        sureBtn.innerHTML = self.options.sureBtn;
        $(sureBtn).addClass("multipleSure");

        $(sureBtn).on("click", function () {
            self.options.comfirm && self.options.comfirm(self.getSelected());
        })

        div.appendChild(sureBtn);


        this.element.appendChild(div);

        return this;
    }

    Plugin.prototype.selectAllHandle = function(){
        var self = this ;
        var checkbox =  $(".filter-multiple-content li");
        if($('.clickAll').hasClass("active")){
            checkbox.removeClass("active");
        }else {
            checkbox.addClass("active");
        }
    }

    Plugin.prototype.getSelected = function(){
        var selected = [],selectFlag = 2;
        var i,len;  //优化变量声明
        var divs = $(".filter-multiple-content li.active[id!='clickAll']");
        for(i=0, len = divs.length; i<len; i++){
            if($(divs[i]).hasClass("active")){
                selected.push(divs[i].getAttribute("data-tab-id"));
            }
        }
        if($('.clickAll').hasClass("active")){
            selectFlag = 1;
        }else if(selected.length == 0 ){
            selectFlag = 0;
        }

        return {selectList:selected,selectFlag:selectFlag};
        //};
    }

    Plugin.prototype.initStyle = function(){
        var self = this;
        var settingContent = self.element.querySelector(".filter-multiple-setting");
        var height= self.element.querySelector(".filter-multiple-content").offsetHeight;
        $(settingContent).css("top",height+"px")

    }


    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content){
        var self = this;
        $(content).on("click", function () {
            $(content).hasClass('active') ? $(content).removeClass('active'):$(content).addClass('active');
            if( $(".filter-multiple-content li[id!='clickAll']").length == $(".filter-multiple-content li.active[id!='clickAll']").length){
                $(".clickAll").addClass('active');
            }else {
                $(".clickAll").removeClass('active');
            }
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


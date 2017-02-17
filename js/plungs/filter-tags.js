/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterTags";
    var defaults = {
        data:{},
        sureBtn:"确定",
        resetBtn:"清空选项",
        multiselectEnable:false,//是否支持多选
        selected:null,
        clickHandle:null, //点击事件
        comfirm:null //点击确认后触发
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
        self.initContent(self.options.data).tagsSetting().initStyle();
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initContent = function(data){
        var self = this;

        var ul= document.createElement('ul');
        $(ul).addClass("filter-tags-content");

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li');

            li.setAttribute("data-tab-id",data[i].key || ("tab"+i));
            li.innerHTML="<span class='tagsDesc'>"+data[i].desc+"<span>";

            li.appendChild(self.tagsShow(data[i].nodeList,data[i].key));

            //绑定点击事件
            ul.appendChild(li);
        }
        this.element.appendChild(ul);

        return this;
    }

    Plugin.prototype.tagsShow = function(tags,type){
        var self = this;
        var ul= document.createElement('ul');
        $(ul).addClass("tags clearfix");
        if(!self.options.selected || !(self.options.selected[type] instanceof Array)){
            self.options.selected = {};
            self.options.selected[type]=new Array();
        };

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = tags.length; i<len; i++){
            var li = document.createElement('li');
            li.setAttribute("data-tags-type",type || "");
            li.setAttribute("data-tags-id",tags[i].key || ("tab"+i));
            li.innerHTML=tags[i].desc;

            if( self.options.selected[type].indexOf(tags[i].key,0) != -1){
                $(li).addClass('active');
            }

            //绑定点击事件
            self.initBind(li,type);
            ul.appendChild(li);
        }

        return ul;
    }

    Plugin.prototype.initStyle = function(){
        var self = this;

        var settingContent = self.element.querySelector(".filter-tags-setting");
        var height= self.element.querySelector(".filter-tags-content").offsetHeight;
        $(settingContent).css("top",height+"px")
    }

    /**
     * 添加 处理按钮
     * @returns {Plugin}
     */
    Plugin.prototype.tagsSetting = function(){
        var self = this;
        var div = document.createElement('div');
        $(div).addClass("filter-tags-setting");

        var resetBtn =  document.createElement('button');
        resetBtn.innerHTML = self.options.resetBtn;
        $(resetBtn).addClass("tagsReset");
        div.appendChild(resetBtn);


        var sureBtn =  document.createElement('button');
        sureBtn.innerHTML = self.options.sureBtn;
        $(sureBtn).addClass("tagsSure");
        div.appendChild(sureBtn);

        $(sureBtn).on("click", function () {
            var select = self.getSelected();
            self.options.comfirm && self.options.comfirm(select);
        })

        $(resetBtn).on("click", function () {
            $(self.element).find(".tags .active").removeClass('active');
        })

        this.element.appendChild(div);
        return this;
    }

    /**
     * 获取所有选择的
     */
    Plugin.prototype.getSelected = function(){
        var i,len;  //优化变量声明
        var tags = document.querySelectorAll(".tags li.active");
        var selected = {};
        // 动态添加数据
        for(i=0, len = tags.length; i<len; i++){
            var type = tags[i].getAttribute("data-tags-type");
            var id = tags[i].getAttribute("data-tags-id");
            if(!selected[type]){
                selected[type]= [];
            }
            selected[type].push(id);
        }
        return selected;
    }

    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content,type){
        var self = this;
        $(content).on("click", function () {

            if( $(content).hasClass('active')){
                $(content).removeClass('active');
            }else {
                (!self.options.multiselectEnable ) &&  $(content).parent().find("li").removeClass('active');
                $(content).addClass('active');
            }

            var key = content.getAttribute("data-tab-id");
            self.options.clickHandle && self.options.clickHandle({key:key,type:type});
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


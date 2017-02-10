/**
 * Created by qinwen on 17/2/7.
 */
;
var Observer = (function(){
    //防止消息队列暴漏而被篡改故将消息容器作为静态私有变量保存
    var _message={};
    return {
        /**
         * 方法: 注册信息接口
         * 参数: type —— 消息类型
         *      fn —— 相应的处理动作
         */
        regist : function (type , fn){
            if(typeof _message[type] === 'undefined'){
                //如果此消息不存在则应创建一个该消息类型,并将该动作推入到该消息对应的动作执行队列中
                _message[type]=[fn];
            }else {
                //如果消息存在,则将动作方法推入该消息对应的动作执行序列中
                _message[type].push(fn);
            }
        },

        /**
         * 方法: 发布信息接口
         * 参数: type —— 消息类型
         *      args —— 动作执行时需要的参数
         */
        fire : function (type , args){
            //如果该消息没有被注册,则返回
            if(!_message[type]){
                return
            }
            //定义消息信息
            var events = {
                    type : type,       // 消息类型
                    args : args || {}  // 消息携带数据
                },
                i = 0, //消息动作循环变量
                len = _message[type].length; //消息动作长度

            for(;i < len;i++){
                _message[type][i].call(this,events);
            }
        },

        /**
         * 方法: 移除信息接口
         * 参数: type —— 消息类型
         *      fn —— 执行的某一个动作
         */
        remove : function (type , fn){
            //如果消息动作队列存在
            if(_message[type] instanceof Array){
                //从最后一个消息动作遍历
                var i=_message[type].length - 1;
                for(;i >=0 ;i--){
                    //如果存在该动作则在消息动作序列中移除相应动作
                    _message[type][i] === fn && _message[type].splice(i,1);
                }
            }
        }
    }
})();
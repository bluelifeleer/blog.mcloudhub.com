(function(global, factory){
    typeof exports !== 'undefined' && typeof module !== 'undefined' ? factory():factory(global);
})(window, function(global){

    const VueMiddleware = {
        installed: false
    }

    VueMiddleware.install = () => {
        Vue.component('dialog-middle',VueMiddleware.generate_component());
        Vue.prototype.$message = VueMiddleware.message;
        this.installed = true;
    }
        
    VueMiddleware.render = function(){
    }

    VueMiddleware.generate_component = () => {
        return VueMiddleware.dialog()
    }

    VueMiddleware.dialog = () => {
        return {
            data:function(){
                return {
                }
            },
            props:{
                visable: Boolean,
                title: String,
                width: Number,
                height: Number,
                showclosebut: Boolean
            },
            template:`<div class="g-middle-dialog" v-if="visable">
                <div class="g-middle-dialog-marker-layer"></div>
                <div class="g-middle-dialog-content-layer" :style="{width:width+'px',height:height+'px'}">
                    <div class="g-middle-dialog-header">
                        <span class="dialog-title">{{title}}</span>
                        <a class="dialog-close-but" href="javascript:void(0);" v-if="showclosebut">关闭</a>
                    </div>
                    <div class="g-middle-dialog-body">
                        <slot></slot>
                    </div>
                    <div class="g-middle-dialog-footer"></div>
                </div>
            </div>`,
            mounted(){
            }
        }
    }

    VueMiddleware.message = opts => {
        let title = VueMiddleware.hasKey(opts, 'title') ? opts.title : '信息提示框';
        let message = VueMiddleware.hasKey(opts, 'message') ? opts.message : '信息提示框';
        let closed = VueMiddleware.hasKey(opts, 'closeed') ? opts.closeed : false;
        let output = `<div class="message-middle">${title}</div>`;
        document.getElementById('app').innerHTML+=output;
    }

    VueMiddleware.IsEmptyObject = object => {
        return typeof object === 'undefined' ? false : (JSON.stringify(object) === '{}' ? false : true);
    }

    VueMiddleware.hasKey = (object, key) => {
        if(VueMiddleware.IsEmptyObject(object)){
            Object.keys(object).forEach(item=>{
                return item == key ? true : false;
            })
        }else{
            return false;
        }
    }

    if(global){
        global.VueMiddleware = VueMiddleware;
        if(global.Vue){
            if(!VueMiddleware.installed){
                Vue.use(VueMiddleware);
            }
        }
    }else{
        module.exports.VueMiddleware = VueMiddleware;
    }

    // console.log(global.Vue.use)
})
// import Vue from "vue";
import bwdModel from "./index.vue";

let instance;
const BwdModel = Vue.extend(bwdModel); 

instance = new BwdModel({
    el:document.createElement("div")
});

const BWDMODEL = {
    show(options = {}){
        document.body.appendChild(instance.$el);

        instance.show = true;
        instance.text = options.text;
        instance.duration = options.duration || 3;
        instance.textStyle = options.textStyle;
        instance.scrollable = options.scrollable || false;

        if( !instance.scrollable ){
            document.body.style.overflow = 'hidden'
        }
        // return;
        function settime( duration ){
            if(duration == 0){
                BWDMODEL.hide()
            }else{
                clearTimeout();
                setTimeout (()=>{
                    duration--;
                    settime( duration )
                },1000)
            }
        }
        settime( instance.duration )
    },
    hide(){
        instance.show = false;
        document.body.style.overflow = 'auto'
    }
}
export default {
    install(){
        if(!Vue.BWDMODEL){
            Vue.$BWDMODEL = BWDMODEL;
        }
        Vue.mixin({
            created(){
                this.$BWDMODEL = Vue.$BWDMODEL;
            }
        })
    }
}
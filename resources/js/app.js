require("./bootstrap");

window.Vue = require("vue");
import Vue from 'vue'
// for scroll
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
// for Notification
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})
// for vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);
Vue.component("message", require("./components/MessageComponent.vue").default);

const app = new Vue({
    el: "#app",
    data: {
        message: "",
        temp:'',
        chat: {
            message: [],
            user: [],
            position: [],
            timeposition: [],
            nameposition: [],
            time:[]
        },
        typing:'',
        numberofusers: 0
    },
    watch:{
        message(){
            Echo.private('chat')
            .whisper('typing', {
                name: this.message
            });
        }
    },
    methods: {
        send() {
            if (this.message.length != 0) {
                console.log(this.message);
                this.chat.message.push(this.message);
                this.chat.user.push("You");
                this.chat.position.push(" ");
                this.chat.nameposition.push("left");
                this.chat.timeposition.push("right");
                this.chat.time.push(this.getTime());
                this.temp = this.message;
                this.message ='';
                axios.post('send', {
                    message : this.temp,
                    chat:this.chat
                  })
                  .then(response => {
                    console.log(response);
                    this.message = '';
                  })
                  .catch(error => {
                    console.log(error);
                  });
            }
        },
        getOldMessages(){
            axios.post('getOldMessage')
                  .then(response => {
                    console.log(response);
                    if (response.data != '') {
                        this.chat = response.data;
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
        },
        deleteSession(){
            axios.post('deleteSession')
            .then(response=> this.$toaster.success('Chat history is deleted') );
        },
        getTime(){
            let time = new Date();
            var month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            var n = month[time.getMonth()];
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return time.getDate()+" "+n+" "+ hours+" : "+minutes+" "+ampm;
        }
    },
    mounted(){
        this.getOldMessages();
        Echo.private('chat')
        .listen('ChatEvent', (e) => {
            this.chat.message.push(e.message);
            this.chat.user.push(e.user);
            this.chat.position.push("right");
            this.chat.nameposition.push("right");
            this.chat.timeposition.push("left");
            this.chat.time.push(this.getTime());
            axios.post('saveToSession',{
                    chat : this.chat
                })
                .then(response => {
                    })
                .catch(error => {
                    console.log(error);
                 });
        })
        .listenForWhisper('typing', (e) => {
            if (e.name != '') {
                this.typing = "typing . . .";
            } else {
                this.typing = "";
            }   
        });
        Echo.join('chat')
        .here((users) => {
            this.numberofusers = users.length;
        })
        .joining((user) => {
            this.numberofusers+=1;
            this.$toaster.success(user.name+' is now active')
        })
        .leaving((user) => {
            this.numberofusers-=1;
            this.$toaster.error(user.name+' is now inactve')
        });
    }
});

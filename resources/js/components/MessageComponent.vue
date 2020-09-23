<template>
    <div class="direct-chat-msg" :class="getPosition">
        <div class="direct-chat-infos clearfix">
            <span class="direct-chat-name" :class="getNamePosition">{{ user }}</span>
                <span class="direct-chat-timestamp" :class="getTimePosition"> {{ time }}</span>
        </div>
                                            <!-- /.direct-chat-infos -->
            <img class="direct-chat-img"
                src="public/admin/dist/img/user1-128x128.jpg"
                                                alt="message user image" />
                                            <!-- /.direct-chat-img -->
			            <div class="direct-chat-text">
			        			<slot></slot>
			    		</div>
        </div>
</template>

<script>
export default {
     props:[
            'position',
            'nameposition',
            'timeposition',
            'user',
            'time'
        ],
        computed:{
            getPosition(){
                return ' '+this.position;
            },
            getNamePosition(){
            	return 'float-'+this.nameposition;
            },
            getTimePosition(){
            	return 'float-'+this.timeposition;
            }
        },
        mounted() {
            console.log('Component mounted.')
        }
};
</script>

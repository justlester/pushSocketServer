
const socket = io();

new Vue({
    el: '#app',
    vuetify: new Vuetify({
        icons: {
            iconfont: 'fa',
        },
    }),
    data() {
        return {
            isUserJoinedChatRoom: false,
            joinChatRoomFormValid: false,
            username: null,
            chatroom: null,
            chatRooms: [
                {
                    text: 'Chat Room 1',
                    value: 'Chat Room 1'
                },
                {
                    text: 'Chat Room 2',
                    value: 'Chat Room 2'
                },
                {
                    text: 'Chat Room 3',
                    value: 'Chat Room 3'
                },
            ],
            chatroomUsers: [],

            
            messageToSend: '',
            chatMessages: [],
        }
    },
    mounted() {
        var that = this;
        //Message from server
        socket.on('message',message=>{
            if(this.isUserJoinedChatRoom){
                console.log(message);
                that.outputMessage(message);
            }
        });

        //Get room and users
        socket.on('roomUsers',({room,users})=>{
            that.chatroomUsers = users;
        });
    },
    methods: {
        joinChatRoom(){
            if(this.$refs.joinChatRoomForm.validate()){
                this.isUserJoinedChatRoom = true;
                socket.emit('joinRoom',{username:this.username,room:this.chatroom});
            }
        },
        leaveChatRoom(){
            this.isUserJoinedChatRoom = false;
            this.chatMessages = [];
            this.chatroomUsers = [];
            socket.emit('leaveRoom');
        },
        sendMessage(){
            if(this.messageToSend){
                socket.emit('chatMessage',this.messageToSend);
                this.messageToSend = '';
                if(this.$refs.chatMessagesContainer){
                    this.$refs.chatMessagesContainer.focus();
                }
            }
        },
        outputMessage(message){
            this.chatMessages.push(message);
            setTimeout(()=>{
                if(this.$refs.chatMessagesContainer){
                    this.$refs.chatMessagesContainer.scrollTop = this.$refs.chatMessagesContainer.scrollHeight;
                }
            },500);
        },
        formatDateTime(datetime){
            return datetime ? new Date(datetime) : '';
        }
    },
});

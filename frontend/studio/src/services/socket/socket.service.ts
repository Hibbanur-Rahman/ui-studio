import io from 'socket.io-client';
import apiUrls from '@/config/apiUrls';

class SocketService{
    socket =null;
    dispatch=null;

    //Initialize the socket connection
    initSocket(headers,dispatch){
        console.log("initSocket",headers,dispatch);
        this.socket=io(apiUrls.base_url,{
            auth:{
                headers:headers,
            }
        });

        this.dispatch=dispatch;
        this.setupListeners();
    }

    //Listeners
    setupListeners(){
        if(!this.socket) return;
        this.socket.on("connect",this.onConnect);
        this.socket.on("disconnect",this.onDisconnect);
        this.socket.on("connectionError",this.onConnectionError);      
    }

    //Emitters
    onConnect=()=>{
        console.log("connected to the server");
    }
    onDisconnect=()=>{
        console.log("disconnect from server");
    }
    onConnectionError=()=>{
        console.log("there is connection error");
    }
    
   
    disconnect(){
        if(this.socket){
            this.socket.disconnect();
        }
    }
}

//singleton instance
const socketService=new SocketService();
export default socketService;
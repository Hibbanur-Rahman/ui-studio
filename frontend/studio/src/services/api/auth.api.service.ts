import Request from "@/config/api.config";

const Login=async()=>Request({
    url:"auth/login",
    method:"POST",
    secure:false
})

export default {
    Login
}
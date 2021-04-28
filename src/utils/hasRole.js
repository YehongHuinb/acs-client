import store from '@/store'

export function hasRole(val){
    let role = store.getters.role;
    if(val == role.roleName){
        return true
    }else{
        return false
    }
    
}
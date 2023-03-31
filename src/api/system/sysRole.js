import request from '@/utils/request'

const api_name = '/admin/system/sysRole'

export default{
    //角色列表-条件分页查询
    getPageList(current,limit,searchObj){
        return request({
            url:`${api_name}/${current}/${limit}`,
            method:'get',
            //body use data
            params:searchObj
        })
    },
    removeById(id){
        return request({
            url:`${api_name}/remove/${id}`,
            method:'delete',
        })
    },
    addRole(sysRole){
        return request({
            url:`${api_name}/save`,
            method:'post',
            data:sysRole,
        })
    },
    findRoleById(id){
        return request({
            url:`${api_name}/get/${id}`,
            method:'get',
        })
    },
    updateRole(sysRole){
        return request({
            url:`${api_name}/update`,
            method:'put',
            data:sysRole,
        })
    },
    removeByList(idList){
        return request({
            url:`${api_name}/batchRemove`,
            method:'delete',
            data:idList,
        })
    }
}
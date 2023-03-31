<template>
<div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 100%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" :loading="loading" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
          <el-button class="btn-add" size="mini" @click="batchRemove()" >批量删除</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection"/>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"/>
        </template>
      </el-table-column>
    </el-table>
        <!-- 分页组件 -->
    <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchData"
    />


    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import api from '@/api/system/sysRole'

export default {
    //初始值
    data(){
        return {
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            searchObj: {},
            sysRole:{},
            dialogVisible: false,
            idList:[]
        }
    },
    //渲染前执行
    created(){
        this.fetchData()
    },
    methods:{
        handleSelectionChange(selection){
          this.idList = selection
        },
        batchRemove(){
          this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                  // 点击确定，远程调用ajax
                  // 遍历selection，将id取出放入id列表
                  var idListNums = []
                  this.idList.forEach(item => {
                    idListNums.push(item.id)
                  })
                    return api.removeByList(idListNums)
                }
                ).then((res)=>{
                      this.fetchData()
                      this.$message.success(response.message || '删除成功')
                })
        },
        add(){
            this.sysRole = {}
            this.dialogVisible = true
        },
        edit(id){
          api.findRoleById(id)
            .then(res =>{
              this.sysRole = res.data
            })
           this.dialogVisible = true
        },
        saveOrUpdate(){
          this.saveBtnDisabled = true // 防止表单重复提交
          if(!this.sysRole.id){
            this.save()
          }else{
            this.update()            
          }
        },
        save(){
            api.addRole(this.sysRole)
            .then(res=>{
              this.$message.success(res.message || '操作成功')
              this.dialogVisible = false
              this.fetchData()
            })
        },
        update(){
          api.updateRole(this.sysRole)
            .then(res=>{
              this.$message.success(res.message || '操作成功')
              this.dialogVisible = false
              this.fetchData(this.page)
            })
        },
        fetchData(current=1){
            this.page = current
            api.getPageList(this.page,this.limit,this.searchObj)
            .then(res =>{
                this.list = res.data.records
                this.total = res.data.total
            })
        },
        removeDataById(id){
             this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    return api.removeById(id)
                }
                ).then((res)=>{
                      this.fetchData(this.page)
                      this.$message.success(response.message || '删除成功')
                })

        },
        resetData() {
            console.log('重置查询表单')
            this.searchObj = {}
            this.fetchData()
        }
    }

}
</script>
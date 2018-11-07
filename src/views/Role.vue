<template>
<el-card>
    <!-- 面包屑 -->
    <my-bread level1='权限管理' level2='角色列表'></my-bread>
    <el-button class="btn" type="primary">+角色</el-button>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" style="width: 100%">

        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
                    <el-col :span="4">
                        <el-tag @close="deleRight(scope.row, item1.id)" closable type='success'>{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-row class="level2" v-for="item2 in item1.children" :key="item2.id">
                            <el-col :span="4">
                                <el-tag @close="deleRight(scope.row, item2.id)" closable>{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRight(scope.row, item3.id)" v-for="item3 in item2.children" :key="item3.id" closable type="info">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                    <br>
                </el-row>
                    <el-row v-if="scope.row.children.length===0">
                        <span class="span-role">该角色未分配权限</span>
                    </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName" min-width="150">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" min-width="150">
        </el-table-column>
        <el-table-column min-width="150" label="操作">
            <template slot-scope="scope">
                <el-row>
                    <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
                    <el-button @click="showRoledia(scope.row)" type="success" size="mini" plain icon="el-icon-check" circle></el-button>
                    <el-button type="danger" size="mini" plain icon="el-icon-delete" circle></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>

    <!-- 弹框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRole">
       <template>
            <el-tree 
            ref='tree'
            :data="treeList" 
            show-checkbox 
            default-expand-all 
            node-key='id' 
            :default-checked-keys="checkArr" 
            :props="defaultProps">
            </el-tree>
       </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
    </el-dialog>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            list: [],
            //分配权限弹框 
            dialogFormVisibleRole: false,
            treeList: [],
            defaultProps: {
                label:'authName',
                children:'children'
            },
            checkArr: [],
            currRoleId:''
        }
    },
    created() {
        this.loadRoleTable()
    },
    methods: {
        // 设置权限
        async setRole() {
            this.dialogFormVisibleRole = false
            const arr1 = this.$refs.tree.getCheckedKeys()
            const arr2 = this.$refs.tree.getHalfCheckedKeys()
            const arr = [...arr1,...arr2]
            const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{
                rids:arr.join(',')
            })
            this.loadRoleTable()
        },
        // 分配权限弹框
        async showRoledia(role) {
              this.currRoleId = role.id
            console.log(role)
            this.dialogFormVisibleRole = true
            const res = await this.$http.get(`rights/tree`)
            console.log(res)
            this.treeList = res.data.data

            const arrCheck = []
            role.children.forEach(item1 => {
                item1.children.forEach(item2 => {
                    item2.children.forEach(item3 => {
                        arrCheck.push(item3.id)
                    })
                })
            })
            this.checkArr = arrCheck
            
        },
        async deleRight(role,rightId) {
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // console.log(res)
            role.children = res.data.data
        },
        // 渲染列表
        async loadRoleTable() {
            const res = await this.$http.get('roles')
            // console.log(res)
            this.list = res.data.data
        }
    }
}
</script>

<style>
.btn {
    margin: 20px
}

.level1 {
    padding-top: 10px;
}

.level2 {
    padding-bottom: 10px;
}
</style>

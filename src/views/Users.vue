<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
        <el-row>
            <el-col :span="6">
                <el-input v-model="seachVal" clearable placeholder="请输入内容" class="input-with-select">
                    <el-button @click="seachUsers()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="18">
                <el-button @click="showAddUser()" type="success" plain>添加用户</el-button>
            </el-col>
        </el-row>
    </div>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" width="180">
        </el-table-column>
        <el-table-column label="姓名" prop="username" width="180">
        </el-table-column>
        <el-table-column label="邮箱" prop="email" width="180">
        </el-table-column>
        <el-table-column label="电话" prop="mobile" width="180">
        </el-table-column>
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.create_time | fmtDate}}
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-row>
                    <el-button @click="showEditdia(scope.row)" type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
                    <el-button @click="showRoledia(scope.row)" type="success" size="mini" plain icon="el-icon-check" circle></el-button>
                    <el-button @click="showDeledia(scope.row)" type="danger" size="mini" plain icon="el-icon-delete" circle></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 弹框 -->
    <!-- 添加 - 弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
        <el-form :model="formData">
            <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑 - 弹框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分配角色 - 弹框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoleuser">
        <el-form>
            <el-form-item label="用户名" :label-width="formLabelWidth">
                {{currUserName}}
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="currRoleId">
                    <el-option disabled label="请选择" :value="-1"></el-option>
                    <el-option v-for="(item, index) in roles" :key="index" :label="item.roleName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRoleuser = false">取 消</el-button>
            <el-button type="primary" @click="setROle()">确 定</el-button>
        </div>
    </el-dialog>

</el-card>
</template>

<script>
export default {

    data() {
        return {
            // 表格数据
            list: [],
            loading: false,
            // 分页数据
            pagenum: 1,
            pagesize: 2,
            total: 1,
            seachVal: '',
            // 添加表单 
            formData: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            formLabelWidth: '120px',
            dialogFormVisibleAdduser: false,
            dialogFormVisibleEdituser: false,
            currUserId: -1,
            // 分配角色
            dialogFormVisibleRoleuser: false,
            currUserName: '',
            currRoleId: -1,
            roles: [],
            getRoleByUserId: -1

        }
    },
    methods: {
        // 分配角色 - 提交表单
        async setROle() {
            this.dialogFormVisibleRoleuser = false
            const res = await this.$http.put(`users/${this.getRoleByUserId}/role`, {
                rid: this.currRoleId
            })
            // console.log(res)
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            if (status === 200) {
                this.$message.success(msg)
            }
        },
        // 分配角色  - 显示对话框
        async showRoledia(user) {
            this.getRoleByUserId = user.id
            // console.log(user)
            this.dialogFormVisibleRoleuser = true
            this.currUserName = user.username
            const res = await this.$http.get('roles')
            this.roles = res.data.data
             const res1 = await this.$http.get(`users/${user.id}`)
              this.currRoleId =  res1.data.data.rid
        },

        // 编辑 - 保单提交
        async editUser() {
            this.dialogFormVisibleEdituser = false
            const res = await this.$http.put(`users/${this.currUserId}`, this.formData)
            // console.log(res)
            const {
                msg,
                status
            } = res.data
            if (status === 200) {
                this.$message.success(msg)

            }
        },
        // 编辑用户
        showEditdia(user) {
            this.dialogFormVisibleEdituser = true
            this.formData = user
            this.currUserId = user.id
            // console.log(user)
        },
        // 添加功能
        async addUser() {

            const res = await this.$http.post(`users`, this.formData)
            // console.log(res)
            const {
                msg,
                status
            } = res.data.meta
            if (status === 201) {
                for (const key in this.formData) {
                    if (this.formData.hasOwnProperty(key)) {
                        this.formData[key] = ''
                    }
                }
                this.$message.success(msg)
                this.loadTableData()
                this.dialogFormVisibleAdduser = false
            }
        },
        // 弹出添加框
        showAddUser() {
            this.dialogFormVisibleAdduser = true
            for (const key in this.formData) {
                if (this.formData.hasOwnProperty(key)) {
                    this.formData[key] = ''
                }
            }
        },
        // 删除功能
        showDeledia(user) {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 发送删除请求
                const res = await this.$http.delete(`users/${user.id}`)
                // console.log(res)
                const {
                    msg,
                    status
                } = res.data.meta
                if (status === 200) {
                    this.pagenum = 1
                    this.loadTableData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })

        },
        // 状态切换按钮
        async changeMgState(user, ) {
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            // console.log(res)
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            if (status === 200) {
                this.$message.success('设置成功')
            }
        },
        // 搜索用户
        seachUsers() {
            this.loadTableData()
        },
        // 分页方法
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.loadTableData()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.pagenum = val
            this.loadTableData()
        },
        // 加载
        async loadTableData() {
            this.loading = true
            const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.seachVal}`)
            console.log(res)
            const {
                meta,
                data
            } = res.data
            if (meta.status === 200) {
                this.list = data.users
                this.loading = false

                this.total = data.total
            }
        }
    },
    mounted() {
        this.loadTableData()
    }
}
</script>

<style>

</style>

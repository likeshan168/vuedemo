<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
<el-table-column type="index" width="80" label="序号">
</el-table-column>
<el-table-column width="80" label="序号">
    <template scope="scope">
        {{(scope.$index + 1)+(page-1)}}
    </template>
</el-table-column>
<el-table-column prop="name" label="用户名" width="180" sortable>
</el-table-column>
<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>
</el-table-column>
<el-table-column prop="email" label="邮箱" width="200" sortable>
</el-table-column>
<el-table-column prop="phoneNumber" label="手机号" width="180" sortable>
</el-table-column>
<el-table-column inline-template :context="_self" label="操作" width="140">
    <span>
                        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
                    </span>
</el-table-column>
</el-table>
</template>
<!--分页-->
<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
<el-pagination layout="total, prev, pager, next, sizes" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="size" :total="total"
    style="float:right;">
</el-pagination>
</el-col>
<!--编辑界面-->
<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户名'" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="editForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
            <el-input v-model="editForm.email" ></el-input-number>
        </el-form-item>
        <el-form-item label="手机号">
            <el-input v-model="editForm.phoneNumber" ></el-input-number>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
    </div>
</el-dialog>
</section>
</template>
<script>
    import NProgress from 'nprogress';
    import { getUserList, deleteUser, updateUser, requestRegister } from '../../api/api';
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                users: [],
                total: 0,
                page: 1,
                size: 20,
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',
                editForm: {
                    id: 0,
                    name: '',
                    password: '',
                    email: '',
                    phoneNumber: '',
                },
                editLoading: false,
                btnEditText: '提 交',
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' }
                    ],
                    phoneNumber: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            handleSizeChange(val){
                this.size = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let para = {
                    index: this.page,
                    size: this.size,
                    orderField:'Id'
                    // whereStr: {
                    //     name: this.filters.name
                    // }
                };
                this.listLoading = true;
                NProgress.start();
                getUserList(para).then(res => {
                    console.log(res);
                    this.total = res.total;
                    this.users = res.users;
                    this.listLoading = false;
                    NProgress.done();
                });
            },
            //删除
            handleDel(row) {
                var _this = this;
                this.$confirm('确认删除该记录吗', '提示', {
                    type: 'info'
                }).then(() => {
                    _this.listLoading = true;
                    NProgress.start();
                    let para = { id: row.id }
                    deleteUser(para).then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        _this.getUsers();
                    })

                }).catch(() => {
                    _this.$notify({
                        title: '失败',
                        message: '删除失败',
                        type: 'error'
                    });
                })
            },
            //编辑 or 新增
            handleEdit: function (row) {
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.id = row.id;
                this.editForm.name = row.name;
                this.editForm.password = row.password;
                this.editForm.email = row.email;
                this.editForm.phoneNumber = row.phoneNumber;
            },
            //提交编辑
            editSubmit() {
                var _this = this;
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认提交吗', '提示', {}).then(() => {
                            _this.editLoading = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';
                            let para = {
                                id: _this.editForm.id,
                                name: _this.editForm.name,
                                password: _this.editForm.password,
                                email: _this.editForm.email,
                                phoneNumber: _this.editForm.phoneNumber,
                            };
                            if (_this.editForm.id == 0) {
                                requestRegister(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getUsers();
                                });
                            } else {
                                updateUser(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getUsers();
                                })
                            }
                        })
                    }
                })
            },
            //显示新增界面
            handleAdd() {
                var _this = this;
                this.editFormVisible = true;
                this.editFormTtile = '新增';

                this.editForm.id = 0;
                this.editForm.name = '';
                this.editForm.password = '';
                this.editForm.email = '';
                this.editForm.phoneNumber = '';
            },

        },
        mounted() {
            console.log('mounted')
            this.getUsers();
        }
    }
</script>
<style scoped>
    
</style>
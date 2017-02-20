<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input v-model="filters.filterName" placeholder="角色名" icon="search" :on-icon-click="getRoles" auto-complete="off" @keyup.enter.native="getRoles"></el-input>
                </el-col>
                <el-button type="primary" @click.native="handleAdd" v-if="checkCreateAutority()">新增</el-button>
            </el-row>
        </el-col>

        <!--列表-->
        <template>
            <el-table :data="roles" highlight-current-row v-loading="listLoading" style="width: 100%;" @expand="expandRow">
                <el-table-column type="expand">
                    <!--<template scope="props">-->
                    <el-col :span="6" v-for="route in allRoutes"><span>{{route.name}}</span></el-col>
                    <!--</template>-->
                </el-table-column>
                <el-table-column width="80" label="序号">
                    <template scope="scope">
                        {{(scope.$index + 1)+(page-1)*size}}
                    </template>
                </el-table-column>
                <el-table-column prop="roleName" label="角色名" width="180" sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="140">
                    <span>
                        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDel(row)" v-if="checkDelAutority()">删除</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination layout="total, prev, pager, next, sizes" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :page-size="size" :total="total" style="float:right;">
                </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="editFormRules" ref="editForm">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24">
                    <el-tag type="primary">r: 只读权限</el-tag>
                    <el-tag type="success">c: 创建权限</el-tag>
                    <el-tag type="warning">u: 更新权限</el-tag>
                    <el-tag type="danger">d: 删除权限</el-tag>
                </el-col>
            </el-row>
            <el-checkbox-group v-model="checkList">
                <el-col :span="6" v-for="route in allRoutes">
                    <el-checkbox :label="route.Name"></el-checkbox>
                </el-col>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import NProgress from 'nprogress';
    import { getRoleList, getRouteByRoleId, addRole, updateRole, deleteRole } from '../../api/api';
    const cols = ['u.*', 'r.RoleName'];
    export default {
        data() {
            return {
                filters: {
                    filterName: ''
                },
                filtersForm: {
                    filterName: [
                        { required: true, message: '请输入查询条件', trigger: 'blur' }
                    ]
                },
                total: 0,
                page: 1,
                size: 20,
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',
                editForm: {
                    roleId: 0,
                    roleName: '',
                },
                editLoading: false,
                btnEditText: '提 交',
                editFormRules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ],
                },
                //角色信息
                roles: [],
                //角色相关的路由信息
                // routes: [],
                checkList: [],
                //所有的路由信息
                allRoutes: [],
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getRoles();
            },
            handleSizeChange(val) {
                this.size = val;
                this.getRoles();
            },
            //获取用户列表
            getRoles() {
                let para;
                this.allRoutes = JSON.parse(sessionStorage.getItem('all_routes')) || '';
                if (this.filters.filterName) {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: 'RoleId',
                        whereStr: `RoleName='${this.filters.filterName}'`,
                        other: this.allRoutes === ''
                    };
                } else {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: 'RoleId',
                        other: this.allRoutes === ''
                    };
                }

                this.listLoading = true;
                NProgress.start();
                getRoleList(para).then(res => {
                    if (res.code === 403) {
                        this.$router.push({ path: 'login', query: { redirect: 'user_list' } })
                    } else if (res.code !== 200) {
                        this.$notify({
                            title: '信息',
                            message: res.msg,
                            type: 'error'
                        });
                    } else {
                        if (res.other) {
                            this.allRoutes = JSON.parse(res.other) || [];
                            sessionStorage.setItem('all_routes', res.other);
                        }

                        this.total = res.total;
                        this.roles = res.roles;
                    }

                    this.listLoading = false;
                    NProgress.done();
                });

                return false;
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
                })
            },
            //编辑 or 新增
            handleEdit: function (row) {
                let _this = this;

                getRouteByRoleId({ roleId: row.roleId }).then(res => {
                    res.routes.forEach(r => {
                        this.checkList.push(r.name);
                    });
                });

                _this.editFormVisible = true;
                _this.editFormTtile = '编辑';
                _this.editForm.roleId = row.roleId;
                _this.editForm.roleName = row.roleName;
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
                                roleId: _this.editForm.roleId,
                                roleName: _this.editForm.roleName,
                                routeId: _this.checkList.length === 0 ? '' : (_this.checkList.map(r => r.split('-')[0])).join(',')
                            };
                            if (_this.editForm.roleId == 0) {
                                addRole(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getRoles();
                                });
                            } else {
                                updateRole(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getRoles();
                                })
                            }
                        })
                    }
                })
            },
            //显示新增界面
            handleAdd() {
                var _this = this;
                _this.checkList = [];
                this.editFormVisible = true;
                this.editFormTtile = '新增';

                this.editForm.roleId = 0;
                this.editForm.roleName = '';
                
            },
            //check the authority
            checkCreateAutority() {
                if (!this.routes)
                    return true;
                if (this.routes.find(r => r.name === '用户列表' && r.op === 'c'))
                    return true;
                else
                    return false;
            },
            checkDelAutority() {
                if (!this.routes)
                    return true;
                if (this.routes.find(r => r.name === '用户列表' && r.op === 'd')) {
                    return true;
                }
                else {
                    return false;
                }
            },
            expandRow(row, expanded) {
                if (expanded) {
                    let _this = this;
                    getRouteByRoleId({ roleId: row.roleId }).then(res => {
                        _this.routes = res.routes;
                        console.log(_this.routes);
                    });
                }
            }
        },
        mounted() {
            this.getRoles();
            this.routes = JSON.parse(sessionStorage.getItem('routes'));
        }
    }

</script>
<style scoped>

</style>
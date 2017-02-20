<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input v-model="filters.filterName" placeholder="名称" icon="search" :on-icon-click="getRoutes" auto-complete="off" @keyup.enter.native="getRoutes"></el-input>
                </el-col>
                <el-button type="primary" @click.native="handleAdd" v-if="checkCreateAuthority">新增</el-button>
                <!--</el-form-item>
            </el-form>-->
            </el-row>
        </el-col>

        <!--列表-->
        <template>
            <el-table :data="routes" highlight-current-row v-loading="listLoading" style="width: 100%;" height="430">
                <el-table-column width="80" label="序号">
                    <template scope="scope">
                        {{(scope.$index + 1)+(page-1)*size}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="180" sortable>
                </el-table-column>
                <el-table-column prop="op" label="权限" width="100" sortable>
                </el-table-column>

                <el-table-column inline-template :context="_self" label="操作" width="140">
                    <span>
                        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDel(row)" v-if="checkDelAuthority">删除</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </template>
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination layout="total, prev, pager, next, sizes" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :page-size="size" :total="total" style="float:right;" :page-sizes="pageSizes">
                </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-select v-model="editForm.op" placeholder="请选择">
                        <el-option label="c" value="c">
                        </el-option>
                        <el-option label="r" value="r">
                        </el-option>
                        <el-option label="u" value="u">
                        </el-option>
                        <el-option label="d" value="d">
                        </el-option>
                    </el-select>
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
    import { getRouteList, addRoute, updateRoute, deleteRoute } from '../../api/api';
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
                routes: [],
                total: 0,
                page: 1,
                size: 1000,
                pageSizes: [10, 20, 30, 40, 50, 100, 1000],
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',
                editForm: {
                    id: 0,
                    name: '',
                    op: ''
                },
                editLoading: false,
                btnEditText: '提 交',
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    op: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                },
                createAuthority: this.routes ? this.routes.find(r => r.name === '用户列表' && r.op === 'c') : false,
                deleteAuthority: this.routes ? this.routes.find(r => r.name === '用户列表' && r.op === 'd') : false,
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getRoutes();
            },
            handleSizeChange(val) {
                this.size = val;
                this.getRoutes();
            },
            //获取用户列表
            getRoutes() {
                let para;
                if (this.filters.filterName) {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: 'RouteId',
                        whereStr: `name='${this.filters.filterName}'`,
                    };
                } else {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: 'RouteId',
                    };
                }

                this.listLoading = true;
                NProgress.start();
                getRouteList(para).then(res => {
                    if (res.code === 403) {
                        this.$router.push({ path: 'login', query: { redirect: 'user_list' } })
                    } else if (res.code !== 200) {
                        this.$notify({
                            title: '信息',
                            message: res.msg,
                            type: 'error'
                        });
                    } else {
                        this.total = res.total;
                        this.routes = res.routes;
                        // console.log(JSON.stringify(res.routes))
                        // sessionStorage.setItem('routes', JSON.stringify(res.routes));
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
                    console.log(row.routeId);
                    let para = { routeId: row.routeId }
                    deleteRoute(para).then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        _this.getRoutes();
                    })

                }).catch(() => {
                })
            },
            //编辑 or 新增
            handleEdit: function (row) {
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.id = row.id;
                this.editForm.name = row.name;
                this.editForm.op = row.op;
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
                                op: _this.editForm.op,
                            };
                            if (_this.editForm.id == 0) {
                                addRoute(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getRoutes();
                                });
                            } else {
                                updateRoute(para).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getRoutes();
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
                this.editForm.op = '';
            },
            //check the authority
            checkCreateAuthority() {
                if (!this.routes)
                    this.createAuhtority = false;
                if (this.routes.find(r => r.name === '用户列表' && r.op === 'c'))
                    this.createAuhtority = true;
                else
                    this.createAuhtority = false;
            },
            checkDelAuthority() {
                if (!this.routes)
                    this.deleteAuthority = false;
                if (this.routes.find(r => r.name === '用户列表' && r.op === 'd')) {
                    this.deleteAuthority = true;
                }
                else {
                    this.deleteAuthority = false;
                }
            }
        },
        mounted() {
            this.getRoutes();
            this.routes = JSON.parse(sessionStorage.getItem('routes'));
            console.log(this.routes);
            // console.log(sessionStorage.getItem('routes'))
            // console.log(this.routes.find(r => r.name === '用户列表' && r.op === 'c'))
        }
    }

</script>
<style scoped>

</style>
<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input v-model="filters.filterName" size="small" placeholder="委托人简称" icon="search" :on-icon-click="getMonthConfigs" auto-complete="off"
                        @keyup.enter.native="getUsers"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-tooltip content="设置结款类型" placement="bottom">
                        <el-autocomplete class="inline-input" size="small" v-model="moneyType" :fetch-suggestions="querySearch" placeholder="设置结款类型"
                            @select="handleSelect"></el-autocomplete>
                    </el-tooltip>
                </el-col>
                <el-col :span="6">
                    <el-button type="info" size="small" @click.native="submitUpdates"><i class="fa fa-floppy-o fa-1x" aria-hidden="true"></i>保存</el-button>
                </el-col>
            </el-row>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="MonthConfigs" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" fixed="left">
                </el-table-column>
                <el-table-column width="80" label="序号">
                    <template scope="scope">
                        {{(scope.$index + 1)+(page-1)*size}}
                    </template>
                </el-table-column>
                <el-table-column prop="委托人简称" label="委托人简称" width="180" sortable>
                </el-table-column>
                <el-table-column prop="月数" label="月数" width="100" sortable>
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
                :page-size="size" :total="total" style="float:right;" :page-sizes="[10, 20, 30, 40, 50, 100,500,1000]">
                </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="委托人简称" prop="委托人简称">
                    <el-input v-model="editForm.委托人简称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="月数" prop="月数">
                    <el-input v-model="editForm.月数" auto-complete="off"></el-input>
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
    import { GetMonthConfig, DeleteMonthConfig, UpdateMonthConfig, getRoleList, NewGuid1 } from '../../api/api';
    const cols = ['委托人简称', '月数'];
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
                MonthConfigs: [],
                total: 0,
                page: 1,
                size: 20,
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',
                editForm: {
                    委托人简称: '',
                    月数: ''
                },
                editLoading: false,
                btnEditText: '提 交',
                editFormRules: {
                    委托人简称: [
                        { required: true, message: '请输入委托人简称', trigger: 'blur' }
                    ],
                    月数: [
                        { required: true, message: '请输入月数', trigger: 'blur' }
                    ],
                },
                //用户权限列表
                routes: [],
                //角色信息
                roles: [],
                //多选
                multipleSelection: [],
                //结款类型
                moneyType: '',
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getMonthConfigs();
            },
            handleSizeChange(val) {
                this.size = val;
                this.getMonthConfigs();
            },
            //获取用户列表
            getMonthConfigs() {
                // alert('alert');
                let para;
                if (this.filters.filterName) {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: '委托人简称',
                        whereStr: `委托人简称='${this.filters.filterName}'`,
                        columns: cols
                    };
                } else {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: '委托人简称',
                        columns: cols
                    };
                }

                this.listLoading = true;
                NProgress.start();
                GetMonthConfig(para).then(res => {
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
                        this.MonthConfigs = res.monthConfigs;
                    }

                    this.listLoading = false;
                    NProgress.done();
                });

                return false;
            },
            //获取角色信息
            getRoles() {
                let para = {
                    index: 1,
                    size: 50,
                    orderField: 'RoleId',
                };
                getRoleList(para).then(res => {
                    // console.log(res.code);
                    if (res.code !== 200) {
                        this.$notify({
                            title: '信息',
                            message: res.msg,
                            type: 'error'
                        });
                    } else {
                        this.roles = res.roles;
                    }
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
                    let para = { 委托人简称: row.委托人简称 }
                    DeleteMonthConfig(para).then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        _this.getMonthConfigs();
                    })

                }).catch(() => {
                })
            },
            //编辑 or 新增
            handleEdit: function (row) {
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.委托人简称 = row.委托人简称;
                this.editForm.月数 = row.月数
            },

            submitUpdates() {
                if (this.multipleSelection.length === 0) {
                    this.$notify({
                        title: '信息',
                        message: '请选需要设置结款的行，然后再进行保存',
                        type: 'info'
                    });
                    return;
                };
                this.$confirm('确认保存所做的修改吗', '提示', { type: 'info' }).then(() => {
                    this.listLoading = true;
                    this.saveLoading = true;
                    UpdateMonthConfig(this.multipleSelection).then(data => {
                        this.listLoading = false;
                        this.saveLoading = false;
                        if (data) {
                            this.$notify({ title: '信息', message: data.msg, type: 'info' });
                        } else {
                            this.$notify({
                                title: '信息', message: data ? data.msg : '保存失败', type: 'error'
                            });
                        }
                    });
                });
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
                                委托人简称: _this.editForm.委托人简称,
                                月数: +_this.editForm.月数
                            };
                            // console.log(para);
                            if (_this.editForm.id == 0) {
                                para.id = NewGuid1();
                                UpdateMonthConfig([para]).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    if (res.code === 200) {
                                        _this.$notify({
                                            title: '信息',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getMonthConfigs();
                                    } else {
                                        _this.$notify({
                                            title: '信息',
                                            message: res.msg,
                                            type: 'error'
                                        });
                                    }

                                });
                            } else {
                                UpdateMonthConfig([para]).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    if (res) {
                                        _this.$notify({
                                            title: '信息',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getMonthConfigs();
                                    } else {
                                        _this.$notify({
                                            title: '信息',
                                            message: '更新失败',
                                            type: 'error'
                                        });
                                    }
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
            //check the authority
            checkCreateAutority() {
                // console.log(this.routes.find(r => r.name === '用户列表' && r.op === 'c'));
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
            handleSelectionChange(val) { this.multipleSelection = val; },
            //下拉框中选择结款类型
            querySearch(queryString, cb) {
                var moneyTypes = this.moneyTypes;
                var results = queryString ? moneyTypes.filter(this.createFilter(queryString)) : moneyTypes;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (moenyType) => {
                    return (moenyType.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            //选择结款类型事件
            handleSelect(item) {
                let type = item.type;
                let multipleSelection = this.multipleSelection;
                if (multipleSelection.length === 0) {
                    this.$notify({
                        title: '提示',
                        message: '请选需要设置的行',
                        type: 'info'
                    });

                    return;
                }
                // console.log(multipleSelection)
                for (let i = 0; i < multipleSelection.length; i++) {
                    this.MonthConfigs.forEach(c => {
                        if (c.委托人简称 === multipleSelection[i].委托人简称) {
                            c.月数 = +type;
                            multipleSelection[i].月数 = +type;
                            return;
                        }
                    })
                }
            },
        },
        mounted() {
            // console.log(JSON.parse(sessionStorage.getItem("routes")));
            this.routes = JSON.parse(sessionStorage.getItem('routes'));
            this.getMonthConfigs();
            this.getRoles();
            this.moneyTypes = [
                { "type": "1", "value": "一个月结款" },
                { "type": "2", "value": "两个月结款" },
                { "type": "3", "value": "季度结款" },
                { "type": "6", "value": "半年结款" },];
        }
    }

</script>
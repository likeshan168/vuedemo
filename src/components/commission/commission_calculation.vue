<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-row :gutter="20">
                <!--<el-form :inline="true" :model="filters" ref="filters" v-on:submit="getCommissions">-->
                <!--<el-form-item prop="filterName">-->
                <el-col :span="4">
                    <el-tooltip content="业务员" placement="bottom">
                        <el-input v-model="filters.saleMan" placeholder="业务员" auto-complete="off" @keyup.enter.native="getCommissions"></el-input>
                    </el-tooltip>
                </el-col>
                <el-col :span="4">
                    <el-tooltip content="委托人简称" placement="bottom">
                        <el-input v-model="filters.principal" placeholder="委托人简称" auto-complete="off" @keyup.enter.native="getCommissions"></el-input>
                    </el-tooltip>
                </el-col>
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                <el-col :span="2">
                    <el-button type="primary" @click.native="getCommissions" icon="search">搜索</el-button>
                </el-col>
                <!--<el-button type="primary" @click.native="SetMonth">设置结款类型</el-button>-->
                <el-col :span="4">
                    <el-tooltip content="设置结款类型" placement="bottom">
                        <el-autocomplete class="inline-input" v-model="moneyType" :fetch-suggestions="querySearch" placeholder="请选择结款类型" @select="handleSelect"></el-autocomplete>
                    </el-tooltip>
                </el-col>
                <el-col :span="4">
                    <el-tooltip content="扣除比例(%)" placement="bottom">
                        <el-input-number v-model="proportion" :step="0.01">
                            <!--<template slot="append">%</template>-->
                        </el-input-number>
                    </el-tooltip>
                </el-col>
                <el-col :span="2">
                    <el-button type="info" @click.native="submitUpdates"><i class="fa fa-floppy-o fa-1x" aria-hidden="true"></i>保存</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="info" @click.native="getCommissions"><i class="fa fa-file-excel-o fa-1x" aria-hidden="true"></i>导出</el-button>
                </el-col>
            </el-row>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="commissions" :row-class-name="tableRowClassName" highlight-current-row v-loading="listLoading" height="430"
                style="width: 100%;" @selection-change="handleSelectionChange">
                <!--<el-table-column type="index" width="80" label="序号">
                </el-table-column>-->
                <el-table-column type="selection" width="55" fixed="left">
                </el-table-column>
                <el-table-column width="80" label="序号">
                    <template scope="scope">
                        {{(scope.$index + 1)+(page-1)*size}}
                    </template>
                </el-table-column>
                <el-table-column prop="工作号" label="工作号" width="180" sortable>
                </el-table-column>
                <el-table-column prop="业务员" label="业务员" width="100" sortable>
                </el-table-column>
                <el-table-column prop="委托人简称" label="委托人简称" width="200" sortable>
                </el-table-column>
                <el-table-column prop="利润" label="利润" width="120" sortable>
                </el-table-column>
                <el-table-column prop="应收折合" label="应收折合" width="120" sortable>
                </el-table-column>
                <el-table-column prop="未收折合" label="未收折合" width="120" sortable>
                </el-table-column>
                <el-table-column prop="收款日期" label="收款日期" width="120" sortable :formatter="formatDate">
                </el-table-column>
                <el-table-column prop="超期日期" label="超期日期" width="120" sortable :formatter="formatDate">
                </el-table-column>
                <el-table-column prop="月数" label="月数" width="120" sortable>
                </el-table-column>
                <el-table-column prop="超期回款资金成本" label="超期回款资金成本" width="180" sortable>
                </el-table-column>
                <el-table-column prop="金额" label="金额" width="120" sortable>
                </el-table-column>
                <el-table-column prop="工作单日期" label="工作单日期" width="150" sortable :formatter="formatDate">
                </el-table-column>
                <el-table-column prop="kb" label="KB" width="120" sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" width="120" fixed="right">
                    <span>
                        <el-button size="small" @click="handleEdit(row)" icon="edit"></el-button>
                        <el-button type="danger" size="small" @click="handleDel(row)" icon="delete"></el-button>
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
        <!--<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input-number>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="editForm.phoneNumber"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>-->

        <el-dialog title="选择结款类型" v-model="moneyTypeFormVisible" size="tiny">
            <el-autocomplete class="inline-input" v-model="moneyType" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
            <div slot="footer" class="dialog-footer">
                <el-button @click="moneyTypeFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="moneyTypeFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import NProgress from 'nprogress';
    import { GetCommissions,commitData } from '../../api/api';
    export default {
        data() {
            return {
                filters: {
                    saleMan: '',
                    principal: ''
                },
                multipleSelection: [],
                salesman: [],
                commissions: [],
                total: 0,
                page: 1,
                size: 20,
                listLoading: false,
                saveLoading:false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',
                editForm: {
                    id: 0,
                    name: '',
                    password: '',
                    email: '',
                    phoneNumber: '',
                },
                //结款类型
                moneyType: '',
                moneyTypeFormVisible: false,
                moneyTypes: [],
                proportion: 0.02,

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
            //日期转换
            formatDate: function (row, column) {
                if (column.label === '收款日期') {
                    let tmpDate = +row.收款日期;
                    if (tmpDate > 0) {
                        return this.formatD(tmpDate);
                    }
                    else {
                        return '';
                    }
                } else if (column.label === '工作单日期') {
                    let tmpDate = +row.工作单日期;
                    if (tmpDate > 0) {
                        return this.formatD(tmpDate);
                    }
                    else {
                        return '';
                    }
                } else if (column.label === '超期日期') {
                    let tmpDate = +row.超期日期;
                    if (tmpDate > 0) {
                        return this.formatD(tmpDate);
                    }
                    else {
                        return '';
                    }
                }
            },
            formatD(d) {
                let date = new Date(d);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                return (Y + M + D);
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getCommissions();
            },
            handleSizeChange(val) {
                this.size = val;
                this.getCommissions();
            },
            getCommissions() {
                let para;
                let whereStr = '';
                if (this.filters.saleMan) {
                    whereStr = `业务员='${this.filters.saleMan}' `;
                }
                if (this.filters.principal) {
                    if (whereStr)
                        whereStr += `and 委托人简称='${this.filters.principal}' `;
                    else
                        whereStr = `委托人简称='${this.filters.principal}' `;
                }
                if (whereStr) {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: '业务员',
                        whereStr: whereStr
                    };
                } else {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: '工作号'
                    };
                }
                this.listLoading = true;
                NProgress.start();
                GetCommissions(para).then(res => {
                    this.total = res.total;
                    this.commissions = res.commissions;
                    this.listLoading = false;
                    NProgress.done();
                });

                return false;
            },
            //将计提结果保存到数据库
            submitUpdates() {
                this.listLoading = true;
                this.saveLoading = true;
                console.log(this.commissions);
                commitData({ columnCount: 0, commissions: this.commissions }).then(data => {
                    this.listLoading = false;
                    this.saveLoading = false;
                    if (data && data.code === 200) {
                        this.$notify({
                            title: '信息',
                            message: data.msg,
                            type: 'info'
                        });
                    } else {
                        this.$notify({
                            title: '信息',
                            message: data ? data.msg : '保存失败',
                            type: 'error'
                        });
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
                    let para = { id: row.id }
                    deleteUser(para).then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        _this.getCommissions();
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
                                    _this.getCommissions();
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
                                    _this.getCommissions();
                                })
                            }
                        })
                    }
                })
            },
            //设置结款类型
            SetMonth() {
                this.moneyTypeFormVisible = true;
            },
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
                let comms = this.commissions;
                let multipleSelection = this.multipleSelection;
                if (multipleSelection.length === 0) {
                    this.$notify({
                        title: '提示',
                        message: '请选需要设置的行',
                        type: 'info'
                    });

                    return;
                }
                let index;
                let collectionDate;
                for (let i = 0; i < multipleSelection.length; i++) {
                    index = comms.findIndex(item => item.工作号 === multipleSelection[i].工作号);
                    comms[index].月数 = +type;
                    let beyondDate = this.calculateBeyondDate(comms[index].工作单日期, +type);
                    comms[index].超期日期 = beyondDate;
                    collectionDate = comms[index].收款日期;
                    //超期
                    let profits = comms[index].利润;
                    if (collectionDate > beyondDate) {
                        let beyondDays = collectionDate - beyondDate;
                        let beyondCost = (+(beyondDays / (1000 * 60 * 60 * 24))) * profits * this.proportion / 100;
                        comms[index].超期回款资金成本 = +beyondCost.toFixed(2);
                        comms[index].金额 = +(profits - beyondCost).toFixed(2);
                    } else {
                        comms[index].金额 = +(profits).toFixed(2);
                    }
                }
            },
            calculateBeyondDate(workingDate, moneyType) {
                let date = new Date(+workingDate);
                //获取工作日期当月的最后一天日期
                let date2 = date.setMonth(date.getMonth() + moneyType);
                let date3 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                return date3.getTime();
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            tableRowClassName(row, index) {
                if (row['超期回款资金成本'] > 0) {
                    return 'beyond-row';
                }
                return '';

            }
        },
        mounted() {
            this.getCommissions();
            this.moneyTypes = [
                { "type": "1", "value": "一个月结款" },
                { "type": "2", "value": "两个月结款" },
                { "type": "3", "value": "季度结款" },
                { "type": "6", "value": "半年结款" },];
        }
    }

</script>
<style>
    .el-table .beyond-row {
        background: red;
    }
</style>
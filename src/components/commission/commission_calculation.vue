<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-row :gutter="10">
                <!--<el-form :inline="true" :model="filters" ref="filters" v-on:submit="getCommissions">-->
                <!--<el-form-item prop="filterName">-->
                <el-col :span="12">
                    <el-col :span="6">
                        <el-tooltip content="请选择查询条件" placement="bottom">
                            <el-select size="small" v-model="dateType" placeholder="请选择查询条件">
                                <el-option label="工作单日期" value="工作单日期">
                                </el-option>
                                <el-option label="超期日期" value="超期日期">
                                </el-option>
                                <el-option label="收款日期" value="收款日期">
                                </el-option>
                            </el-select>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="11">
                        <el-tooltip content="选择要查询的日期范围" placement="bottom">
                            <el-date-picker v-model="pickDate" @keyup.enter.native="getCommissions" @change="handleDatePickChange" type="daterange" size="small"
                                align="right" placeholder="选择日期范围" :picker-options="pickerOptions">
                                </el-date-picker>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="7">
                        <el-tooltip content="工作号,业务员,委托人简称" placement="bottom">
                            <el-input v-model="filters.saleMan" placeholder="工作号,业务员,委托人简称" size="small" auto-complete="off" @keyup.enter.native="getCommissions"
                                icon="search" :on-icon-click="getCommissions"></el-input>
                        </el-tooltip>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="10">
                        <el-tooltip content="设置结款类型" placement="bottom">
                            <el-autocomplete class="inline-input" size="small" v-model="moneyType" :fetch-suggestions="querySearch" placeholder="设置结款类型"
                                @select="handleSelect"></el-autocomplete>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="10">
                        <el-tooltip content="扣除比例(%)" placement="bottom">
                            <el-input-number v-model="proportion" :step="0.01" size="small">
                            </el-input-number>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="info" size="small" @click.native="submitUpdates"><i class="fa fa-floppy-o fa-1x" aria-hidden="true"></i>保存</el-button>
                    </el-col>
                </el-col>
                <el-col :span="4">
                    <el-col :span="12">
                        <el-button type="info" size="small" @click.native="exportExcel"><i class="fa fa-file-excel-o fa-1x" aria-hidden="true"></i>导出</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button type="warning" size="small" @click.native="handleDel" icon="del">删除</el-button>
                    </el-col>
                </el-col>
            </el-row>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="commissions" :row-class-name="tableRowClassName" v-loading="listLoading" height="430" style="width: 100%;"
                @selection-change="handleSelectionChange">
                <!--<el-table-column type="index" width="80" label="序号">
                </el-table-column>-->
                <el-table-column type="selection" width="55" fixed="left">
                </el-table-column>
                <el-table-column width="80" label="序号">
                    <template scope="scope">
                        {{(scope.$index + 1)+(page-1)*size}}
                    </template>
                </el-table-column>
                <el-table-column v-for="(column,index) in checkedColumns" width="180" sortable :prop="column" :label="column" :formatter="formatDate"
                    :filters="[{ text: '超期结款', value: '超期结款' }, { text: '正常结款', value: '正常结款' }, { text: '未结款', value: '未结款' }]"
                    :filter-method="filterRows">
                    </el-table-column>
                    <!--<el-table-column prop="工作号" label="工作号" width="180" sortable>
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
                </el-table-column>-->
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
                <el-tooltip content="选择要显示的列" placement="top">
                    <el-popover placement="right" width="600" trigger="click" v-model="popVisible">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllColumns" @change="handleCheckAllColumnsChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
                            <el-row>
                                <el-col :span="6">
                                    <el-checkbox label="工作号"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="业务员"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="委托人简称"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="利润"></el-checkbox>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-checkbox label="应收折合"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="未收折合"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="收款日期"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="超期日期"></el-checkbox>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-checkbox label="月数"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="超期回款资金成本"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="金额"></el-checkbox>
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox label="工作单日期"></el-checkbox>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-checkbox label="KB"></el-checkbox>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                        <div style="text-align: right; margin: 0">
                            <el-button type="text" @click="popVisible = false">关闭</el-button>
                        </div>
                        <el-button slot="reference"><i class="el-icon-setting"></i></el-button>
                    </el-popover>

                </el-tooltip>
                <el-tooltip content="绿色的行表示结款正常" placement="top">
                    <el-tag type="success">绿色的行表示结款正常</el-tag>
                </el-tooltip>
                <el-tooltip content="黄色表示未结款或部分结款" placement="top">
                    <el-tag type="warning">黄色表示未结款或部分结款</el-tag>
                </el-tooltip>
                <el-tooltip content="红色表示结款超期" placement="top">
                    <el-tag type="danger">红色表示结款超期</el-tag>
                </el-tooltip>

        </el-col>
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" :inline="true" label-width="80px" ref="editForm">
                <el-form-item label="工作号" prop="工作号">
                    <el-input v-model="editForm.工作号" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="业务员" prop="业务员">
                    <el-input v-model="editForm.业务员" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="委托人简称" prop="委托人简称">
                    <el-input v-model="editForm.委托人简称"></el-input>
                </el-form-item>
                <el-form-item label="利润" prop="利润">
                    <el-input v-model="editForm.利润"></el-input>
                </el-form-item>
                <el-form-item label="应收折合" prop="应收折合">
                    <el-input v-model="editForm.应收折合"></el-input>
                </el-form-item>
                <el-form-item label="未收折合" prop="未收折合">
                    <el-input v-model="editForm.未收折合"></el-input>
                </el-form-item>
                <el-form-item label="收款日期" prop="收款日期">
                    <el-date-picker v-model="editForm.收款日期" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="超期日期" prop="超期日期">
                    <el-date-picker v-model="editForm.超期日期" :disabled="true" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="月数" prop="月数">
                    <el-input-number v-model="editForm.月数" :min="0" :step="1" @change="handleMonthChange"></el-input-number>
                </el-form-item>
                <el-form-item label="超期回款资金成本" prop="超期回款资金成本">
                    <el-input v-model="editForm.超期回款资金成本" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="金额">
                    <el-input v-model="editForm.金额" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="工作单日期" prop="工作单日期">
                    <el-date-picker v-model="editForm.工作单日期" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="kb" prop="kb">
                    <el-input v-model="editForm.kb"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择结款类型" v-model="moneyTypeFormVisible" size="tiny">
            <el-autocomplete class="inline-input" v-model="moneyType" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
            <div slot="footer" class="dialog-footer">
                <el-button @click="moneyTypeFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="moneyTypeFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

        <!--<el-popover ref="popoverColumn" placement="top" width="400" trigger="click">
            <el-table>
                <el-table-column width="150" property="date" label="日期"></el-table-column>
                <el-table-column width="100" property="name" label="姓名"></el-table-column>
                <el-table-column width="300" property="address" label="地址"></el-table-column>
            </el-table>
        </el-popover>-->
    </section>
</template>
<script>
    import NProgress from 'nprogress';
    import { GetCommissions, commitData, DelCommissions, JSONToExcelConvertor } from '../../api/api';
    const columnOptions = ['工作号', '业务员', '委托人简称', '利润', '应收折合', '未收折合', '收款日期', '超期日期', '月数', '超期回款资金成本', '金额', '工作单日期', 'KB'];
    export default {
        data() {
            return {
                filters: {
                    saleMan: '',
                },
                multipleSelection: [],
                salesman: [],
                commissions: [],
                total: 0,
                page: 1,
                size: 20,
                listLoading: false,
                saveLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',
                editForm: {
                    工作号: '',
                    业务员: '',
                    委托人简称: '',
                    利润: 0,
                    应收折合: 0,
                    未收折合: 0,
                    收款日期: '',
                    超期日期: '',
                    月数: 0,
                    超期回款资金成本: 0,
                    金额: 0,
                    工作单日期: '',
                    kb: ''
                },
                //结款类型
                moneyType: '',
                moneyTypeFormVisible: false,
                moneyTypes: [],
                proportion: 0.02,

                editLoading: false,
                btnEditText: '提 交',
                //选择显示的列
                popVisible: false,
                checkAllColumns: true,
                checkedColumns: columnOptions,
                Columns: columnOptions,
                isIndeterminate: false,

                //日期范围选择
                dateType: '',
                pickDate: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

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
                } else {
                    return row[column.label];
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
                console.log(this.dateType);
                console.log(this.pickDate);
                if (this.pickDate && this.pickDate[0] && this.pickDate[1]) {
                    whereStr = `${this.dateType} between '${this.formatD(this.pickDate[0])}' and '${this.formatD(this.pickDate[1])}' `;
                }
                if (this.filters.saleMan) {
                    if (whereStr)
                        whereStr = whereStr + ` and 业务员 like '%${this.filters.saleMan}%' or 委托人简称 like '%${this.filters.saleMan}%' or 工作号 like '%${this.filters.saleMan}%' `;
                    else
                        whereStr = `业务员 like '%${this.filters.saleMan}%' or 委托人简称 like '%${this.filters.saleMan}%' or 工作号 like '%${this.filters.saleMan}%' `;
                }
                if (whereStr) {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: '业务员',
                        whereStr: whereStr,
                        columns: this.checkedColumns
                    };
                } else {
                    para = {
                        index: this.page,
                        size: this.size,
                        orderField: '工作号',
                        columns: this.checkedColumns
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
                if (this.multipleSelection.length === 0) {
                    this.$notify({
                        title: '信息',
                        message: '请选需要设置结款的行，然后再进行保存',
                        type: 'info'
                    });
                    return;
                }
                this.listLoading = true;
                this.saveLoading = true;
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

                let para;
                if (row.工作号) {
                    para = [{ 工作号: row.工作号 }]
                }
                else {
                    para = _this.multipleSelection;
                    console.log(para.length);
                    if (!para || para.length === 0) {
                        _this.$notify({
                            title: '消息',
                            message: '请选择要删除的行',
                            type: 'info'
                        });
                        return;
                    }
                }

                this.$confirm('确认删除该记录吗', '提示', {
                    type: 'info'
                }).then(() => {
                    _this.listLoading = true;
                    NProgress.start();


                    DelCommissions(para).then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        if (res) {
                            _this.$notify({
                                title: '消息',
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.getCommissions();
                        } else {
                            _this.$notify({
                                title: '消息',
                                message: '删除失败',
                                type: 'error'
                            });
                        }
                    })
                }).catch(() => {
                })
            },
            //编辑 or 新增
            handleEdit: function (row) {
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.工作号 = row.工作号;
                this.editForm.业务员 = row.业务员;
                this.editForm.委托人简称 = row.委托人简称;
                this.editForm.利润 = row.利润;
                this.editForm.应收折合 = row.应收折合;
                this.editForm.未收折合 = row.未收折合;
                this.editForm.收款日期 = row.收款日期;
                this.editForm.超期日期 = row.超期日期;
                this.editForm.月数 = row.月数;
                this.editForm.超期回款资金成本 = row.超期回款资金成本;
                this.editForm.金额 = row.金额;
                this.editForm.工作单日期 = row.工作单日期;
                this.editForm.kb = row.kb;
            },
            //编辑界面中月数的改变
            handleMonthChange(val) {
                let beyondDate = this.calculateBeyondDate(this.editForm.工作单日期, +val);
                this.editForm.超期日期 = beyondDate;
                let collectionDate = this.editForm.收款日期;
                //超期
                let profits = this.editForm.利润;
                if (collectionDate > beyondDate) {
                    let beyondDays = collectionDate - beyondDate;
                    let beyondCost = (+(beyondDays / (1000 * 60 * 60 * 24))) * profits * this.proportion / 100;
                    this.editForm.超期回款资金成本 = +beyondCost.toFixed(2);
                    this.editForm.金额 = +(profits - beyondCost).toFixed(2);
                } else {
                    this.editForm.金额 = +(profits).toFixed(2);
                    this.editForm.超期回款资金成本 = 0.00;
                }
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
                            let cdate = new Date(_this.editForm.收款日期);
                            let wdate = new Date(_this.editForm.工作单日期);
                            let para = {
                                工作号: _this.editForm.工作号,
                                业务员: _this.editForm.业务员,
                                委托人简称: _this.editForm.委托人简称,
                                利润: _this.editForm.利润,
                                应收折合: _this.editForm.应收折合,
                                未收折合: _this.editForm.未收折合,
                                收款日期: cdate.getTime() + 480 * 60 * 1000,
                                超期日期: _this.editForm.超期日期,
                                应收折合: _this.editForm.应收折合,
                                月数: _this.editForm.月数,
                                超期回款资金成本: _this.editForm.超期回款资金成本,
                                金额: _this.editForm.金额,
                                工作单日期: wdate.getTime() + 480 * 60 * 1000,
                                kb: _this.editForm.kb
                            };
                            console.log(para);
                            if (_this.editForm.工作号 === "") {
                                commitData({ columnCount: 0, commissions: [para] }).then((res) => {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    if (res.code === 200) {
                                        _this.$notify({
                                            title: '消息',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getCommissions();
                                    }
                                    else {
                                        _this.$notify({
                                            title: '消息',
                                            message: res.msg,
                                            type: 'error'
                                        });
                                    }

                                });
                            } else {
                                commitData({ columnCount: 0, commissions: [para] }).then((res) => {
                                    console.log(res);
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    if (res.code === 200) {
                                        _this.$notify({
                                            title: '消息',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getCommissions();
                                    }
                                    else {
                                        _this.$notify({
                                            title: '消息',
                                            message: res.msg,
                                            type: 'error'
                                        });
                                    }
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
                    // comms[index].超期日期 = beyondDate;
                    collectionDate = comms[index].收款日期;
                    //超期
                    let profits = comms[index].利润;
                    console.log(collectionDate);
                    if (collectionDate > beyondDate) {
                        let beyondDays = collectionDate - beyondDate;
                        let beyondCost = (+(beyondDays / (1000 * 60 * 60 * 24))) * profits * this.proportion / 100;
                        comms[index].超期回款资金成本 = +beyondCost.toFixed(2);
                        comms[index].金额 = +(profits - beyondCost).toFixed(2);
                        comms[index].超期日期 = beyondDate;
                    } else {
                        //正常结款
                        if (collectionDate > 0) {
                            comms[index].金额 = +(profits).toFixed(2);
                            comms[index].超期日期 = beyondDate;
                        } else {//未结款或部分结款
                            this.$notify({
                                title: '提示',
                                message: '选中的行包含未结款或者部分结款，不予计算提成',
                                type: 'info'
                            });
                        }
                    }
                }
            },
            calculateBeyondDate(workingDate, moneyType) {
                let date = new Date(+workingDate);
                //获取工作日期当月的最后一天日期
                let date2 = date.setMonth(date.getMonth() + moneyType);
                let date3 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var timezoneOffset = date.getTimezoneOffset();
                return date3.getTime() + 480 * 60 * 1000;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            tableRowClassName(row, index) {
                if (row['超期回款资金成本'] > 0) {
                    return 'beyond-row';
                } else if (+row['收款日期'] < 0) {
                    return 'unsettled-row';
                } else if (+row['收款日期'] > 0 && +row['金额'] > 0) {
                    return 'normal-row';
                }
            },
            handleCheckAllColumnsChange(event) {
                this.checkedColumns = event.target.checked ? this.Columns : [];
                this.isIndeterminate = false;
            },
            handleCheckedColumnsChange(value) {
                let checkedCount = value.length;
                this.checkAllColumns = checkedCount === this.Columns.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.Columns.length;
            },
            //筛选行
            filterRows(value, row) {
                if (value === '未结款') {
                    return +row.收款日期 < 0;
                } else if (value === '超期结款') {
                    return row.超期回款资金成本 > 0
                } else if (value === '正常结款') {
                    return +row.收款日期 > 0 && +row.金额 > 0 && row.超期回款资金成本 === 0
                }
            },
            //选择日期
            handleDatePickChange(val) {
                if (!this.dateType) {
                    this.pickDate = '';
                    this.$notify({
                        title: '消息',
                        message: '请选择要查询的时间类型',
                        type: 'info'
                    });
                }
            },
            //导出excel
            exportExcel() {
                if (this.multipleSelection.length === 0) {
                    this.$notify({
                        title: '消息',
                        message: '请选择要导出的行',
                        type: 'info'
                    });
                } else {
                    JSONToExcelConvertor(this.multipleSelection, "test", this.checkedColumns);
                }
            },
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
        background: indianred;
    }
    
    .el-table .normal-row {
        background: lightgreen;
    }
    
    .el-table .unsettled-row {
        background: sandybrown;
    }
</style>
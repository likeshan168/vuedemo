<template>
  <div>
    <el-upload action="http://localhost:63787/api/commission/upload" type="drag" :multiple="true" :on-preview="handlePreview"
      :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError">
      <i class="el-icon-upload"></i>
      <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <el-dialog :title="editFormTtile" v-model="tableVisible" :close-on-click-modal="false">
        <el-table highlight-current-row v-loading="listLoading" :data="tableData" height="300" border style="width: auto">
          <el-table-column type="index" width="80" label="序号">
          </el-table-column>
          <el-table-column v-for="(column,index) in columns" sortable :prop="column" :label="column" :formatter="formatDate">
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="tableVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">{{btnSaveText}}</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import { commitData } from '../../api/api';
  export default {
    data() {
      return {
        tableVisible: false,
        saveLoading: false,
        btnSaveText: '保存',
        listLoading: true,
        editFormTtile: '上传结果',
        tableData: [],
        columns: []
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        let _this = this;
        _this.listLoading = true;
        _this.columns = file.response.columns;
        _this.tableVisible = true;
        _this.tableData = JSON.parse(file.response.data);
        _this.listLoading = false;
      },
      handleSuccess(response, file, fileList) {
        let _this = this;
        _this.$notify({
          title: '信息',
          message: response.msg,
          type: 'info'
        });

        _this.columns = response.columns;
        _this.tableVisible = true;
        _this.tableData = JSON.parse(response.data);
        _this.listLoading = false;
      },
      handleError(err, response, file) {

      },
      saveSubmit() {
        this.listLoading = true;
        this.saveLoading = true;
        commitData({ columnCount: this.columns.length, commissions: this.tableData }).then(data => {
          this.listLoading = false;
          this.saveLoading = false;
          if (data && data.code === 200) {
            this.$notify({
              title: '信息',
              message: data.msg,
              type: 'info'
            });
             this.tableVisible = false;
          } else {
            this.$notify({
              title: '信息',
              message: data ? data.msg : '保存失败',
              type: 'error'
            });
          }

        });
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      formatDate(row, column) {
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
        }
        else {
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
    }
  }

</script>
<template>
  <div> 
    <el-upload action="http://localhost:63787/api/commission/upload" type="drag" :multiple="true" :on-preview="handlePreview" :on-remove="handleRemove"
        :on-success="handleSuccess" :on-error="handleError">
        <i class="el-icon-upload"></i>
        <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
    </el-upload>
    <el-dialog :title="editFormTtile" v-model="tableVisible" :close-on-click-modal="false">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <!--<el-table-column
          prop="date"
          label="日期"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          :formatter="formatter">
        </el-table-column>-->
        <el-table-column v-for="(column,index) in columns"
          prop="column"
          label="column">
        </el-table-column>
        <!--<el-table-column
          prop="tag"
          label="标签"
          width="100"
          :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
          :filter-method="filterTag">
          <template scope="scope">
            <el-tag
              :type="scope.row.tag === '家' ? 'primary' : 'success'"
              close-transition>{{scope.row.tag}}</el-tag>
          </template>-->
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
export default {
    data() {
      return {
        tableVisible : false,
        saveLoading : false,
        btnSaveText:'保存',
        editFormTtile:'上传结果',
        tableData: [],
        columns:[]
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSuccess(response, file, fileList){
        let _this = this;
        _this.$notify({
                        title: '信息',
                        message: response.msg,
                        type: 'info'
                    });
        console.log(response.data);
        if(response.data){
          let firstRow = response.data[0];
          if(firstRow){
            console.log(response.data.length);
          }
        }
        _this.tableVisible = true;
      },
      handleError(err, response, file){

      },
      saveSubmit(){

      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      }
    }
  }
</script>
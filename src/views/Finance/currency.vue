<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCoins">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="coin" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="currencyId" label="币种Id" width="100" sortable>
			</el-table-column>
			<el-table-column prop="currencyName" label="币种名称" width="120" sortable>
			</el-table-column>
			<el-table-column  label="充币二维码" width="160" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.ewcodeImg" width='160 px' height="160 px">
        </template>
			</el-table-column>
			<el-table-column prop="ewcodeUrl" label="充币地址" width="200" sortable>
			</el-table-column>
			<el-table-column  label="币种图标" min-width="120" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.currencyIcon" width='120 px' height="120 px">
        </template>
			</el-table-column>
			<el-table-column prop="maxbet" label="最大下注" width="120" sortable>
			</el-table-column>
			<el-table-column prop="minbet" label="最小下注" width="120" sortable>
			</el-table-column>
			<el-table-column prop="money" label="等值RMB" width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="币种ID" prop="currencyId">
					<el-input v-model="editForm.currencyId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="币种名称" prop="currencyName">
				  <el-input v-model="editForm.currencyName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="二维码">
				<el-upload
            class="avatar-uploader" 
            action=""
            accept="image/jpeg,image/png"          
            :show-file-list="false"
            :on-change="onUploadChange"
            :auto-upload="false">
            <img v-if="ewcodeImg" :src="ewcodeImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
				</el-form-item>
				<el-form-item label="充币地址">
					<el-input v-model="editForm.ewcodeUrl" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="币种图标">
					<el-upload
            class="avatar-uploader" 
            action=""
            accept="image/jpeg,image/png"          
            :show-file-list="false"
            :on-change="onUploadChanges"
            :auto-upload="false">
            <img v-if="currencyIcon" :src="currencyIcon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
				</el-form-item>
				<el-form-item label="最大下注" prop="maxbet">
				  <el-input v-model="editForm.maxbet" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最小下注" prop="minbet">
				  <el-input v-model="editForm.minbet" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="等值RMB" prop="money">
				  <el-input v-model="editForm.money" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="币种ID" prop="currencyId">
					<el-input v-model="addForm.currencyId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="币种名称" prop="currencyName">
				  <el-input v-model="addForm.currencyName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="二维码">
				<el-upload
            class="avatar-uploader" 
            action=""
            accept="image/jpeg,image/png"          
            :show-file-list="false"
            :on-change="onUploadChange"
            :auto-upload="false">
            <img v-if="ewcodeImg" :src="ewcodeImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
				</el-form-item>
				<el-form-item label="充币地址">
					<el-input v-model="addForm.ewcodeUrl" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="币种图标">
					<el-upload
            class="avatar-uploader" 
            action=""
            accept="image/jpeg,image/png"          
            :show-file-list="false"
            :on-change="onUploadChanges"
            :auto-upload="false">
            <img v-if="currencyIcon" :src="currencyIcon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
				</el-form-item>
				<el-form-item label="最大下注" prop="maxbet">
				  <el-input v-model="addForm.maxbet" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最小下注" prop="minbet">
				  <el-input v-model="addForm.minbet" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="等值RMB" prop="money">
				  <el-input v-model="addForm.money" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
  import {coinList,editCoin,addCoin,removeCoin} from '/api/goods'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				coin: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					currencyId: [
						{ required: true, message: '请输入币种Id', trigger: 'blur' }
					],
          currencyName: [
						{ required: true, message: '请输入币种名称', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					currencyId: '',
					currencyName: '',
					ewcodeImg:'',
					ewcodeUrl: '',
					currencyIcon: '',
					maxbet:'',
					minbet:'',
					money:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					currencyId: [
						{ required: true, message: '请输入币种Id', trigger: 'blur' }
					],
          currencyName: [
						{ required: true, message: '请输入币种名称', trigger: 'blur' }
					],
				},
				//新增界面数据
				addForm: {
				  currencyId: '',
					currencyName: '',
					ewcodeImg:'',
					ewcodeUrl: '',
					currencyIcon: '',
					maxbet:'',
					minbet:'',
					money:''
				},
        //二维码
        ewcodeImg:'',
        //图标
        currencyIcon:''
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCoins();
			},
			//获取币种列表
			getCoins() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				coinList(para).then((res) => {
					this.total = res.data.total;
					this.coin = res.data.coin;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { currencyId: row.currencyId };
					removeCoin(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCoins();
					});
				})
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
        this.ewcodeImg=row.ewcodeImg;
        this.currencyIcon=row.currencyIcon;
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
				  currencyId: '',
					currencyName: '',
					ewcodeImg:'',
					ewcodeUrl: '',
					currencyIcon: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
              para.ewcodeImg=this.ewcodeImg;
              para.currencyIcon=this.currencyIcon;
							editCoin(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
                this.ewcodeImg='';
                this.currencyIcon='';
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCoins();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
              para.ewcodeImg=this.ewcodeImg;
              para.currencyIcon=this.currencyIcon;
							addCoin(para).then((res) => {
								this.addLoading = false;
								if(res.success){
									this.$message({
										message: res.message,
										type: 'success'
									});
									this.ewcodeImg='';
									this.currencyIcon='';
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getCoins();
								}else{
									this.$message.error(res.message);
								}
								
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
      //选择二维码
      onUploadChange(file){
        let that=this;
        const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png');
        const isLt1M = file.size / 1024 / 1024 < 1;

        if (!isIMAGE) {
          this.$message.error('只能上传jpg/png图片!');
          return false;
        }
        if (!isLt1M) {
          this.$message.error('上传文件大小不能超过 1MB!');
          return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e){
            that.ewcodeImg=this.result //图片的base64数据
        }
        
      },
      //选择图标
      onUploadChanges(file){
        let that=this;
        const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png');
        const isLt1M = file.size / 1024 / 1024 < 1;

        if (!isIMAGE) {
          this.$message.error('只能上传jpg/png图片!');
          return false;
        }
        if (!isLt1M) {
          this.$message.error('上传文件大小不能超过 1MB!');
          return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e){
            that.currencyIcon=this.result //图片的base64数据
        }
      }
		},
		mounted() {
			this.getCoins();
		}
	}

</script>

<style scoped>

</style>
<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="期数"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBei">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="beiList" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="期数" width="160" sortable>
			</el-table-column>
			<el-table-column prop="bei" label="倍数基数" width="160" sortable>
			</el-table-column>
			<el-table-column prop="begintime" label="开始时间" min-width="160" :formatter="begintime" sortable>
			</el-table-column>
            <el-table-column prop="endtime" label="结束时间" min-width="160" :formatter="endtime" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="期数" prop="id">
					<el-input v-model="addForm.id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="倍数基数" prop="bei">
				  <el-input v-model="addForm.bei" auto-complete="off"></el-input>
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
	import {beiList,addBei} from '/api/goods'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				beiList: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列		

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					id: [
						{ required: true, message: '请输入期数', trigger: 'blur' }
					],
          			bei: [
						{ required: true, message: '请输入倍数基数', trigger: 'blur' }
					],
				},
				//新增界面数据
				addForm: {
				  	id:'',
					bei:''
				},		
			}
		},
		methods: {
            //开始日期转换
            begintime: function (row, column) {
				if(row.begintime){
					let date= new Date(row.begintime)
					return util.formatDate.format(date,'yyyy-MM-dd hh:mm:ss')
				}else{
					return ''
				}
                
			},
			//结束日期转换
            endtime: function (row, column) {
				if(row.endtime){
					let date= new Date(row.endtime)
					return util.formatDate.format(date,'yyyy-MM-dd hh:mm:ss')
				}else{
					return ''
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getBei();
			},
			//获取充值列表
			getBei() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				beiList(para).then((res) => {
					this.total = res.data.total;
					this.beiList = res.data.beiList;
					this.listLoading = false;
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					id:'',
					bei:''
				};
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							addBei(para).then((res) => {
								this.addLoading = false;
								if(res.success){								
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getBei();
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
		},
		mounted() {
			this.getBei();
		}
	}

</script>

<style scoped>

</style>
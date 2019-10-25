<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCommissions">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="Commissions" highlight-current-row v-loading="listLoading" @selection-change="selsChange" border style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="usr_id" label="用户ID" width="180" sortable>
			</el-table-column>
			<el-table-column prop="usr_name" label="用户名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Generalizationcode" label="推广码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Agencylevel" label="代理等级" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Agencystatus" label="代理级别" width="120" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="sl" label="推广人数" width="120" sortable>
			</el-table-column>
			<el-table-column prop="yjze" label="佣金总数" width="120" sortable>
			</el-table-column>
			<el-table-column prop="liushui" label="当月流水" width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改等级</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="代理等级" prop="Agencylevel">
					<el-select v-model="editForm.Agencylevel" placeholder="请选择">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="代理级别" prop="Agencystatus">
					<el-select v-model="editForm.Agencystatus" placeholder="请选择">
						<el-option
						v-for="item in AgencystatusList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {getCommissionList,setAgencylevel} from '/api/index'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				Commissions: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列		
				//代理等级
				options: [{
					value: '1',
					label: '等级一'
					}, {
					value: '2',
					label: '等级二'
					}, {
					value: '3',
					label: '等级三'
					}, {
					value: '4',
					label: '等级四'
					}, {
					value: '5',
					label: '等级五'
				}],
				//代理级别
				AgencystatusList:[{
					value: '0',
					label: '普通'
					}, {
					value: '1',
					label: 'VIP'
				}],
				editFormVisible:false,
				editLoading:false,
				editForm:{
					usr_id:'',
					Agencylevel:'',
					Agencystatus:''
				}

			}
		},
		methods: {
			//类型转换
			formatSex: function (row, column) {
				return row.Agencystatus == '0' ? '普通' : 'VIP';
			},
			
			handleCurrentChange(val) {
				this.page = val;
				this.getCommissions();
			},
			//获取佣金列表
			getCommissions() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				getCommissionList(para).then((res) => {
					this.total = res.data.total;
					this.Commissions = res.data.Commissions;
					this.listLoading = false;
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//提交编辑
			editSubmit(){
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							setAgencylevel(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCommissions();
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
			this.getCommissions();
		}
	}

</script>

<style scoped>

</style>
<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" border style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="usr_id" label="用户ID" width="180" sortable>
			</el-table-column>
			<el-table-column prop="login_id" label="账号" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="usr_name" label="用户名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="usr_pswd" label="密码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="coincode" label="提币密码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="admin_flg" label="管理员标志" width="140" :formatter="formatSex"  sortable>
			</el-table-column>
			<el-table-column prop="creation_time" label="创建时间" min-width="160" :formatter="formatdate" sortable>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button size="small" @click="setadmin(scope.$index, scope.row)">授权</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改密码</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="密码" prop="usr_pswd">
					<el-input v-model="editForm.usr_pswd" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="提币密码">
				  <el-input v-model="editForm.coincode" auto-complete="off"></el-input>
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
	import {getUserListPage,editAdmin,setpswd} from '/api/index'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列		

				editFormVisible:false,
				editLoading:false,
				editFormRules: {
					usr_pswd: [
						{ required: true, message: '请输入新密码', trigger: 'blur' }
					]
				},
				editForm:{
					usr_id:'',
					usr_pswd:'',
					coincode:''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.admin_flg == '0' ? '管理员' : '用户';
			},
			//日期转换
            formatdate: function (row, column) {
                let date= new Date(row.creation_time)
				return util.formatDate.format(date,'yyyy-MM-dd hh:mm:ss')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
				});
			},
			//显示管理员界面
			setadmin: function (index, row) {
				this.$confirm('确认升级该用户为管理员吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { usr_id: row.usr_id };
					editAdmin(para).then(res =>{
						this.listLoading = false;
						this.$message({
							message: '升级成功！',
							type: 'success'
						});
						this.getUsers();
					})
				})
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
							setpswd(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>
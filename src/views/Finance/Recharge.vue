<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRecharge">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="rechargeList" border  :row-class-name="tableRowClassName"  highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="订单号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="usr_name" label="用户名称" width="120" sortable>
			</el-table-column>
            <el-table-column prop="currencyName" label="币种" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="currencyUrl" label="用户地址" width="160" sortable>
			</el-table-column>
			<el-table-column prop="num" label="数量" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="ApplyDate" label="创建时间" min-width="180" :formatter="formatdate" sortable>
			</el-table-column>
			<el-table-column prop="examineDate" label="审核时间" min-width="180" :formatter="formatenddate" sortable>
			</el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatSex" width="100"  sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope" v-if="scope.row.status==0">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" >审核</el-button>
					<el-button size="small" @click="closeEdit(scope.$index, scope.row)">关闭</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {rechargeList,editRecharge,closeRecharge} from '/api/goods'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				rechargeList: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列				
			}
		},
		methods: {
			tableRowClassName(row) {
				console.log(row.status);
				if (row.status == 0) {
					return 'red-row';
				} else if (row.status == 1) {
					return 'green-row';
				}else{
					return 'blue-row';
				}
			},
			formatstatus:function(row, column){
				if(row.status!=0){
					return true
				}else{
					return false
				}
			},
			//状态转换
			formatSex: function (row, column) {
				return row.status == '0' ? '未审核' : row.status == '1' ? '已到账':row.status == '2' ? '已关闭':'未知' ;
			},
            //创建时间转换
            formatdate: function (row, column) {
                let date= new Date(row.ApplyDate)
				return util.formatDate.format(date,'yyyy-MM-dd hh:mm:ss')
			},
			//创建时间转换
            formatenddate: function (row, column) {
				if(row.examineDate){
					let date= new Date(row.examineDate)
					return util.formatDate.format(date,'yyyy-MM-dd hh:mm:ss')
				}else{
					return ''
				}
                
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getRecharge();
			},
			//获取充值列表
			getRecharge() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				rechargeList(para).then((res) => {
					this.total = res.data.total;
					this.rechargeList = res.data.rechargeList;
					this.listLoading = false;
				});
			},
			//审核
			handleEdit: function (index, row) {
				this.$confirm('确认审核该记录?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {id: row.id,flow_type:'充币',currencyName:row.currencyName};
					editRecharge(para).then(res =>{
						this.listLoading = false;
						this.$message({
							message: '审核成功！',
							type: 'success'
						});
						this.getRecharge();
					})
				})
			},
			//关闭
			closeEdit: function (index, row) {
				this.$confirm('确认关闭该记录?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {id: row.id,flow_type:'关闭',currencyName:row.currencyName };
					closeRecharge(para).then(res =>{
						this.listLoading = false;
						this.$message({
							message: '关闭成功！',
							type: 'success'
						});
						this.getRecharge();
					})
				})
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getRecharge();
		}
	}

</script>

<style scoped>
	.el-table .red-row{
		background: #ff0000;
	}

	.el-table .green-row{
		background:  #7FFF00;
	}

	.el-table .blue-row{
		background:  blue;
	}
</style>
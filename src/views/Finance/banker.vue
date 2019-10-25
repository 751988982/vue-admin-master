<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
                <el-form-item>
					<el-input v-model="filters.currencyName" placeholder="币种"></el-input>
				</el-form-item>
                <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="bankerLists">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="gamebatList" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<el-table-column prop="id" label="订单号" width="120" sortable> 
			</el-table-column>
            <el-table-column prop="currencyName" label="币种" width="120"  sortable>
			</el-table-column>
            <el-table-column prop="usr_name" label="用户名称" width="180" sortable>
			</el-table-column>
			<el-table-column prop="banker_num" label="奖池金额" width="180" sortable>
			</el-table-column>
			<el-table-column prop="banker_pro'" label="奖池占比" width="180" :formatter="formatpro" sortable>
			</el-table-column>
			<el-table-column prop="banker_profit" label="累计利润" min-width="180" sortable>
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
	import {bankerList} from '/api/goods'

	export default {
		data() {
			return {
				filters: {
					name: '',
                    currencyName:''
				},
				gamebatList: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列				
			}
		},
		methods: {
			//性别显示转换
			formatpro: function (row, column) {
				return  Number(row.banker_pro)*100+'%'
			},
			handleCurrentChange(val) {
				this.page = val;
				this.bankerLists();
			},
			//获取游戏数据列表
			bankerLists() {
				let para = {
					page: this.page,
					name: this.filters.name,
                    currencyName: this.filters.currencyName
				};
				this.listLoading = true;
				bankerList(para).then((res) => {
					this.total = res.data.total;
					this.gamebatList = res.data.gamebatList;
					this.listLoading = false;
				});
			},
			// //审核
			// handleEdit: function (index, row) {
			// 	this.$confirm('确认该记录已到账?', '提示', {
			// 		type: 'warning'
			// 	}).then(() => {
			// 		this.listLoading = true;
			// 		let para = {id: row.id };
			// 		editRecharge(para).then(res =>{
			// 			this.listLoading = false;
			// 			this.$message({
			// 				message: '审核成功！',
			// 				type: 'success'
			// 			});
			// 			this.bankerLists();
			// 		})
			// 	})
			// },
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.bankerLists();
		}
	}

</script>

<style scoped>

</style>
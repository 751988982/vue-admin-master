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
					<el-button type="primary" v-on:click="capitalLists">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="capitalList" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			 <el-table-column type="index" width="180"></el-table-column>
			<el-table-column prop="usr_id" label="用户ID" width="200" sortable> 
			</el-table-column>
            <el-table-column prop="usr_name" label="用户名称" width="220"  sortable>
			</el-table-column>
            <el-table-column prop="currencyId" label="币种ID" width="220" sortable>
			</el-table-column>
			<el-table-column prop="currencyName" label="币种名称" width="220" sortable>
			</el-table-column>
			<el-table-column prop="currencyNum'" label="余额" :formatter="formatpro" width="210"  sortable>
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
	import {capitalList} from '/api/goods'

	export default {
		data() {
			return {
				filters: {
					name: '',
                    currencyName:''
				},
				capitalList: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列				
			}
		},
		methods: {
			//性别显示转换
			formatpro: function (row, column) {
				return  Number(row.currencyNum)
			},
			handleCurrentChange(val) {
				this.page = val;
				this.capitalLists();
			},
			//获取游戏数据列表
			capitalLists() {
				let para = {
					page: this.page,
					name: this.filters.name,
                    currencyName: this.filters.currencyName
				};
				this.listLoading = true;
				capitalList(para).then((res) => {
                    console.log(res.data.capitalList[0].currencyNum);
					this.total = res.data.total;
					this.capitalList = res.data.capitalList;
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
			this.capitalLists();
		}
	}

</script>

<style scoped>

</style>
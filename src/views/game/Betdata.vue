<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.periods" placeholder="期数"></el-input>
				</el-form-item>
                <el-form-item>
					<el-input v-model="filters.currencyName" placeholder="币种"></el-input>
				</el-form-item>
                <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getGameBat">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="gamebatList" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<el-table-column prop="id" label="订单号" width="100" sortable> 
			</el-table-column>
			<el-table-column prop="periods" label="期数" width="100" sortable>
			</el-table-column>
            <el-table-column prop="currencyName" label="币种" width="100"  sortable>
			</el-table-column>
            <el-table-column prop="gametype" label="游戏类型" width="120" sortable>
			</el-table-column>
            <el-table-column prop="usr_name" label="用户名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="bei" label="投入倍数" width="120" sortable>
			</el-table-column>
			<el-table-column prop="investment" label="投入金额" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="profit" label="收益" min-width="100" sortable>
			</el-table-column>
            <el-table-column prop="startdate" label="开始时间" :formatter="startdate" width="170"  sortable>
			</el-table-column>
            <el-table-column prop="enddate" label="结束时间" :formatter="enddate" width="170"  sortable>
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
	import {gamebatList,editRecharge} from '/api/goods'

	export default {
		data() {
			return {
				filters: {
					name: '',
                    periods:'',
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
			//日期转换
            startdate: function (row, column) {
                let date= new Date(row.startdate)
				return util.formatDate.format(date,'yyyy-MM-dd hh:mm:ss')
			},
            //日期转换
            enddate: function (row, column) {
                let date= new Date(row.enddate)
				return util.formatDate.format(date,'yyyy-MM-dd hh:mm:ss')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getGameBat();
			},
			//获取游戏数据列表
			getGameBat() {
				let para = {
					page: this.page,
					name: this.filters.name,
                    currencyName: this.filters.currencyName,
                    periods:this.filters.periods
				};
				this.listLoading = true;
				gamebatList(para).then((res) => {
					this.total = res.data.total;
					this.gamebatList = res.data.gamebatList;
					this.listLoading = false;
				});
			},
			//审核
			handleEdit: function (index, row) {
				this.$confirm('确认该记录已到账?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {id: row.id };
					editRecharge(para).then(res =>{
						this.listLoading = false;
						this.$message({
							message: '审核成功！',
							type: 'success'
						});
						this.getGameBat();
					})
				})
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getGameBat();
		}
	}

</script>

<style scoped>

</style>
<template>
	<el-row class="panel">
		<el-col :span="24" class="panel-top">
			<el-col :span="20" style="font-size:26px;">
				<img src="../assets/logo4.png" class="logo">
				<span>
					AD<i style="color:#20a0ff">MIN</i>
				</span>
			</el-col>
			<el-col :span="4">
				<el-tooltip class="item tip-logout" effect="dark" content="退出" placement="bottom" style="padding:0px;">
					<!--<i class="logout" v-on:click="logout"></i>-->
					<i>欢迎：{{currentUserName}}</i>
					<i class="fa fa-sign-out" aria-hidden="true" v-on:click="logout"></i>
				</el-tooltip>
			</el-col>
		</el-col>
		<el-col :span="24" class="panel-center">
			<!--<el-col :span="4">-->
			<aside style="width:230px;">
				<!--<h5 class="admin">
					<i class="fa fa-user" aria-hidden="true" style="margin-right:5px;"></i>欢迎：{{currentUserName}}</h5>-->
				<el-menu style="border-top: 1px solid #475669;" :default-active="currentPath" class="el-menu-vertical-demo" @open="handleopen"
					@close="handleclose" @select="handleselect" theme="dark" unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf&&isValidRoute(item.name)">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="changePath(child.path)" v-if="isValidRoute(child.name)">
								<template>
									<i :class="child.iconCls"></i>{{child.name}}
								</template>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0 && isValidRoute(item.children[0].name)" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
					</el-menu>
			</aside>
			<section class="panel-c-c">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" style="margin-bottom:15px;">
						<strong style="width:200px;float:left;color: #475669;">{{currentPathName}}</strong>
						<el-breadcrumb v-if="currentPath!=='/'" separator="/" style="float:right;">
							<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathNameParent!=''">{{currentPathNameParent}}</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathName!=''">{{currentPathName}}</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" style="background-color:#fff;box-sizing: border-box;">
						<!--<transition name="fade">-->
						<router-view>
						</router-view>

						<!--</transition>-->
					</el-col>
				</div>
			</section>
			<!--</el-col>-->
		</el-col>
	</el-row>
</template>
<script>
	import { fetchUser } from '../api/api';
	export default {
		data() {
			return {
				currentPath: '/',
				currentPathName: '首页',
				currentPathNameParent: '',
				currentUserName: fetchUser() ? fetchUser().name : '',
				routes: [],
				a: sessionStorage.getItem('access_token')
			}
		},
		watch: {
			'$route'(to, from) {//监听路由改变
				// console.log(this.$route.query)
				this.currentPath = to.path;
				this.currentPathName = to.name;
				this.currentPathNameParent = to.matched[0].name;
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('access_token');
					_this.$router.replace('/login');
				}).catch((err) => {

				});
			},
			isValidRoute(name) {
				if (!this.routes)
					return true;
				if (this.routes.find(a => a.name === name)) {
					return true;
				} else {
					return false;
				}
			},
			changePath(path) {
				return path + '?a=' + this.a;
			}
		},
		mounted() {
			this.routes = JSON.parse(sessionStorage.getItem('routes'));
			// console.log(JSON.parse(sessionStorage.getItem('routes')));
		}
	}

</script>
<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s
	}
	
	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}
	
	.panel {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}
	
	.panel-top {
		height: 60px;
		line-height: 60px;
		background: #1F2D3D;
		color: #c0ccda;
	}
	
	.panel-center {
		background: #324057;
		position: absolute;
		top: 60px;
		bottom: 0px;
		overflow: hidden;
	}
	
	.panel-c-c {
		background: #f1f2f7;
		position: absolute;
		right: 0px;
		top: 0px;
		bottom: 0px;
		left: 230px;
		overflow-y: scroll;
		padding: 20px;
	}
	
	.logout {
		background: url(../assets/logout_36.png);
		background-size: contain;
		width: 20px;
		height: 20px;
		float: left;
	}
	
	.logo {
		width: 40px;
		float: left;
		margin: 10px 10px 10px 18px;
	}
	
	.tip-logout {
		float: right;
		margin-right: 20px;
		padding-top: 5px;
	}
	
	.tip-logout i {
		cursor: pointer;
	}
	
	.admin {
		color: #c0ccda;
		text-align: center;
	}
</style>
<template>
    <el-form :model="formModel" :rules="formRule" ref="formModel" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="account">
            <el-input type="text" v-model="formModel.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="formModel.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked style="margin:0px 0px 35px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width: 100%" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
            <!--<el-button @click.native.prevent="handleReset2('formModel')">重置</el-button>-->

            <!--以后添加注册功能，取消下面的注释-->
            <!--<router-link to="/register" class="register">注册</router-link>-->
        </el-form-item>
    </el-form>
</template>
<script>
    import { requestLogin, fetchUser } from '../../api/api';
    import NProgress from 'nprogress';
    export default {
        data() {
            return {
                logining: false,
                formModel: {
                    account: fetchUser().name,
                    checkPass: fetchUser().password
                },
                formRule: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            }
        },
        methods: {
            //重置表单
            handleReset2(formName) {
                this.$refs[formName].resetFields();
            },
            //提交表单
            handleSubmit2() {
                try {
                    let _this = this;
                    this.$refs.formModel.validate((valid) => {
                        if (valid) {
                            this.logining = true;
                            NProgress.start();
                            var loginParams = { name: this.formModel.account, password: this.formModel.checkPass };
                            requestLogin(loginParams).then(data => {
                                this.logining = false;
                                NProgress.done();
                                let { msg, code, user, routes, accessToken } = data;
                                if (code !== 200) {
                                    this.$notify({
                                        title: '错误',
                                        message: msg,
                                        type: 'error'
                                    });
                                } else {
                                    sessionStorage.setItem('access_token', accessToken);
                                    sessionStorage.setItem('routes', JSON.stringify(routes));
                                    localStorage.setItem('user', JSON.stringify(user));
                                    if (this.$route.query.redirect) {
                                        this.$router.push({ path: this.$route.query.redirect, query: { a: accessToken } });
                                    } else {
                                        this.$router.push({ path: '/', query: { a: accessToken } });
                                    }
                                }
                            })
                        } else {
                            console.log('error submit');
                            return false;
                        }
                    });
                } catch (error) {
                    this.$alert(error, '错误信息', { confirmButtonText: '确定' });
                }

            }
        }
    }

</script>

<style scoped>
    .card-box {
        padding: 20px;
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin-bottom: 20px;
        background-color: #F9FAFC;
        margin: 120px auto;
        width: 400px;
        border: 2px solid #8492A6;
    }
    
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
    
    .loginform {
        width: 350px;
        padding: 35px 35px 15px 35px;
    }
    
    .register {
        position: relative;
        left: 318px;
    }
</style>
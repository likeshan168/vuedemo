<template>
    <el-form :model="formModel" :rules="formRule" ref="formModel" label-position="left" label-width="0px" class="demo-ruleForm card-box registerform">
        <h3 class="title">新用户注册</h3>
        <el-form-item prop="name">
            <el-input type="text" v-model="formModel.name" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="email">
            <el-input type="email" v-model="formModel.email" auto-complete="off" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="formModel.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
            <el-input type="password" v-model="formModel.confirmPassword" auto-complete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber">
            <el-input type="password" v-model="formModel.phoneNumber" auto-complete="off" placeholder="手机号"></el-input>
        </el-form-item>

        <el-form-item style="width:100%;">
<el-button type="primary" style="width: 100%" @click.native.prevent="handleSubmit2" :loading="logining">注册</el-button>
<router-link to="/login" class="login">登录</router-link>

</el-form-item>
</el-form>
</template>
<script>
    import { requestRegister } from '../../api/api';
    import NProgress from 'nprogress';
    export default {
        data() {
            //自定义验证
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formModel.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                logining: false,
                formModel: {
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phoneNumber: ''
                },
                formRule: {
                    name: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    confirmPassword: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                    ],
                    phoneNumber: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' },
                    ],

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
                let _this = this;
                this.$refs.formModel.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        NProgress.start();

                        var registerParams = {
                            name: this.formModel.name,
                            password: this.formModel.password,
                            confirmPassword: this.formModel.confirmPassword,
                            email: this.formModel.email,
                            phoneNumber: this.formModel.phoneNumber
                        };
                        console.log(requestRegister);
                        requestRegister(registerParams).then(data => {
                            this.logining = false;
                            NProgress.done();
                            let { msg, code, user } = data;
                            if (code !== 200) {
                                this.$notify({
                                    title: '错误',
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                // localStorage.setItem('user', JSON.stringify(user));
                                // if (this.$route.query.redirect) {
                                //     this.$router.push({ path: this.$route.query.redirect });
                                // } else {
                                //     this.$router.push({ path: '/table' });
                                // }
                                console.log(user);
                            }
                        })
                    } else {
                        console.log('error submit');
                        return false;
                    }
                });
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
  
  .registerform {
    width: 350px;
    padding: 35px 35px 15px 35px;
  }
  .login{
      position: relative;
      left: 318px;
  }
</style>
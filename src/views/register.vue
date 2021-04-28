<template>
  <div class="register">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
    >
      <h3 class="title">在线批改系统</h3>
      <el-form-item prop="userName">
        <el-input
          v-model="registerForm.userName"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input
          v-model="registerForm.checkPassword"
          type="password"
          auto-complete="off"
          placeholder="确认密码"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="phonenumber">
        <el-input
          v-model="registerForm.phoneNumber"
          auto-complete="off"
          placeholder="手机号码"
          maxlength="11"
        >
          <svg-icon
            slot="prefix"
            icon-class="phonenumber"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="registerForm.roleId" placeholder="我的身份">
          <el-option
            v-for="role in roleOptions"
            :key="role.roleId"
            :label="role.roleName"
            :value="role.roleId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          size="medium"
          type="text"
          style="width: 100%"
          @click.native.prevent="toLogin"
        >
          <span>已有账号？点我登陆</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listRole } from "@/api/role";
import { addUser } from '@/api/user'


export default {
  data() {
    var checkPasswordRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,

      roleOptions: [],

      registerForm: {
        username: "",
        password: "",
        checkPassword: "",
        telephone: "",
        roleId: undefined,
      },

      registerRules: {

        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
        ],
        checkPassword: [{ validator: checkPasswordRule, trigger: "blur" }],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {

    listRole().then((res) => {
      this.roleOptions = res.data;
    });

  },

  methods: {

    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          
          addUser(this.registerForm).then(res => {
            this.loading = false;
            this.msgSuccess("注册成功");
            this.toLogin()
          })
        }
      });
    },

    toLogin() {
      this.$router.push({ path: "/login" });
    },
  },
};
</script>

<style lang='scss' scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
</style>
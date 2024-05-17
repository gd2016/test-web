<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="login_container">
      <div class="user-layout-lang"></div>
      <div class="user-layout-content">
        <div class="top">
          <div class="header">
            <a href="/">
              <img src="@/assets/icons/vite.svg" class="logo" alt="logo" />
              <span class="title">Ant Design</span>
            </a>
          </div>
          <div class="desc">
            <!-- {{ $t('layouts.userLayout.title') }} -->
          </div>
        </div>

        <div class="main">
          <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
            <a-tabs :active-key="customActiveKey" :tab-bar-style="{ textAlign: 'center', borderBottom: 'unset' }" @change="handleTabClick">
              <a-tab-pane key="tab1" :tab="$t('user.login.tab-login-credentials')">
                <a-alert v-if="isLoginError" type="error" show-icon style="margin-bottom: 24px" :message="$t('user.login.message-invalid-credentials')" />
                <a-form-item>
                  <a-input
                    size="large"
                    type="text"
                    :placeholder="$t('user.login.username.placeholder')"
                    v-decorator="[
                      'username',
                      { rules: [{ required: true, message: $t('user.userName.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change' }
                    ]"
                  >
                    <template #prefix>
                      <a-icon type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item>
                  <a-input-password
                    size="large"
                    :placeholder="$t('user.login.password.placeholder')"
                    v-decorator="['password', { rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur' }]"
                  >
                    <template #prefix>
                      <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </a-tab-pane>
              <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">
                <a-form-item>
                  <a-input
                    size="large"
                    type="text"
                    :placeholder="$t('user.login.mobile.placeholder')"
                    v-decorator="[
                      'mobile',
                      { rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: $t('user.login.mobile.placeholder') }], validateTrigger: 'change' }
                    ]"
                  >
                    <template #prefix>
                      <a-icon type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </template>
                  </a-input>
                </a-form-item>

                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="16">
                    <a-form-item>
                      <a-input
                        size="large"
                        type="text"
                        :placeholder="$t('user.login.mobile.verification-code.placeholder')"
                        v-decorator="['captcha', { rules: [{ required: true, message: $t('user.verification-code.required') }], validateTrigger: 'blur' }]"
                      >
                        <template #prefix>
                          <a-icon type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="8">
                    <a-button class="getCaptcha" tabindex="-1" :disabled="state.smsSendBtn" @click.stop.prevent="getCaptcha">获取验证码</a-button>
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>

            <a-form-item>
              <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember-me') }}</a-checkbox>
              <!-- <router-link :to="{ name: 'recover', params: { user: 'aaa' } }" class="forge-password" style="float: right">
          {{ $t('user.login.forgot-password') }}
        </router-link> -->
            </a-form-item>

            <a-form-item style="margin-top: 24px">
              <a-button size="large" type="primary" html-type="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn">
                {{ $t('user.login.login') }}
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <div class="footer">
          <div class="links">
            <a href="_self">帮助</a>
            <a href="_self">隐私</a>
            <a href="_self">条款</a>
          </div>
          <div class="copyright">Copyright &copy; 2018 vueComponent</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import api from '@/api'

export default {
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: {},
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created() {
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    // handler
    $t(key) {
      const obj = {
        'user.login.userName': '用户名',
        'user.login.password': '密码',
        'user.login.username.placeholder': '账户: admin',
        'user.login.password.placeholder': '密码: admin or ant.design',
        'user.login.message-invalid-credentials': '账户或密码错误（admin/ant.design）',
        'user.login.message-invalid-verification-code': '验证码错误',
        'user.login.tab-login-credentials': '账户密码登录',
        'user.login.tab-login-mobile': '手机号登录',
        'user.login.mobile.placeholder': '手机号',
        'user.login.mobile.verification-code.placeholder': '验证码',
        'user.login.remember-me': '自动登录',
        'user.login.forgot-password': '忘记密码',
        'user.login.sign-in-with': '其他登录方式',
        'user.login.signup': '注册账户',
        'user.login.login': '登录',
        'user.register.register': '注册',
        'user.register.email.placeholder': '邮箱',
        'user.register.password.placeholder': '请至少输入 6 个字符。请不要使用容易被猜到的密码。',
        'user.register.password.popover-message': '请至少输入 6 个字符。请不要使用容易被猜到的密码。',
        'user.register.confirm-password.placeholder': '确认密码',
        'user.register.get-verification-code': '获取验证码',
        'user.register.sign-in': '使用已有账户登录',
        'user.register-result.msg': '你的账户：{email} 注册成功',
        'user.register-result.activation-email': '激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。',
        'user.register-result.back-home': '返回首页',
        'user.register-result.view-mailbox': '查看邮箱',
        'user.email.required': '请输入邮箱地址！',
        'user.email.wrong-format': '邮箱地址格式错误！',
        'user.userName.required': '请输入帐户名或邮箱地址',
        'user.password.required': '请输入密码！',
        'user.password.twice.msg': '两次输入的密码不匹配!',
        'user.password.strength.msg': '密码强度不够 ',
        'user.password.strength.strong': '强度：强',
        'user.password.strength.medium': '强度：中',
        'user.password.strength.low': '强度：低',
        'user.password.strength.short': '强度：太短',
        'user.confirm-password.required': '请确认密码！',
        'user.phone-number.required': '请输入正确的手机号',
        'user.phone-number.wrong-format': '手机号格式错误！',
        'user.verification-code.required': '请输入验证码！'
      }
      return obj[key]
    },
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = md5(values.password)
          api.user
            .login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch((err) => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          // getSmsCaptcha({ mobile: values.mobile })
          //   .then((res) => {
          //     setTimeout(hide, 2500)
          //     this.$notification['success']({
          //       message: '提示',
          //       description: '验证码获取成功，您的验证码为：' + res.result.captcha,
          //       duration: 8
          //     })
          //   })
          //   .catch((err) => {
          //     setTimeout(hide, 1)
          //     clearInterval(interval)
          //     state.time = 60
          //     state.smsSendBtn = false
          //     this.requestFailed(err)
          //   })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      api.user.logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess(res) {
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .login_container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .login_container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    background-size: 100%;
    //padding: 50px 0 84px;
    position: relative;

    .user-layout-lang {
      width: 100%;
      height: 40px;
      line-height: 44px;
      text-align: right;

      .select-lang-trigger {
        cursor: pointer;
        padding: 12px;
        margin-right: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        vertical-align: middle;
      }
    }

    .user-layout-content {
      padding: 32px 0 24px;

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, 0.85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        // position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }

    a {
      text-decoration: none;
    }
  }
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>

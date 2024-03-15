<template>
  <q-page
    padding
    class="login-body q-mx-auto"
    style="width: 500px; max-width: 90vw"
  >
    <q-card
      flat
      bordered
      class="q-mt-md"
    >
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            outlined
            type="email"
            v-model="form.email"
            label="E-mail address *"
            hint="Your registered email address"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            outlined
            type="password"
            v-model="form.password"
            label="Your password *"
            hint="Your password"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />


          <div>
            <q-btn
              unelevated
              no-caps
              label="Login"
              type="submit"
              color="primary"
            />
            <q-btn
              class="q-ml-md"
              flat
              to="/auth/register"
              no-caps
              label="Register"
              type="submit"
              color="primary"
            />
            <q-btn
              class="float-right"
              flat
              no-caps
              label="Forgot Password"
              color="dark"
              @click="modals.forgot_password.open = true"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-inner-loading :showing="form.loading">
        <q-spinner-ios size="3.5em" color="secondary"/>
      </q-inner-loading>
    </q-card>
    <!--    MODALS-->
    <!--    FORGOT PASSWORD MODAL-->
    <q-dialog v-model="modals.forgot_password.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h6 text-primary">Forgot Password</div>
          </div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit.prevent="forgotPassword"
            class="q-gutter-md"
          >
            <q-input
              outlined
              type="email"
              v-model="modals.forgot_password.email"
              label="E-Mail address*"
              hint="Your registered E-Mail address"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <div>
              <q-btn
                unelevated
                no-caps
                type="submit"
                color="primary"
                class="full-width"
              >Reset Password
              </q-btn>
            </div>

          </q-form>
        </q-card-section>

        <q-inner-loading :showing="modals.forgot_password.loading">
          <q-spinner-ios size="3.5em" color="secondary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>


    <!--    RESET PASSWORD MODAL-->
    <q-dialog v-model="modals.reset_password.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h6 text-primary">Reset Password</div>
          </div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit.prevent="resetPassword"
            class="q-gutter-md"
          >

            <q-input
              outlined
              type="number"
              v-model="modals.reset_password.token"
              label="Token *"
              hint="4-digit code sent to your E-Mail"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="password"
              v-model="modals.reset_password.new_password"
              label="New Password *"
              hint="Your new password"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="password"
              v-model="modals.reset_password.new_password_confirm"
              label="Confirm New Password *"
              hint="Confirm your new password"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <div>
              <q-btn
                unelevated
                no-caps
                type="submit"
                color="primary"
                class="full-width"
              >Reset Password
              </q-btn>
            </div>

          </q-form>
        </q-card-section>

        <q-inner-loading :showing="modals.reset_password.loading">
          <q-spinner-ios size="3.5em" color="secondary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import {notifySuccess, notifyWarning} from '../../my-helpers/helper'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        form: {
          email: null,
          password: null,
          loading: false
        },
        modals: {
          forgot_password: {
            open: false,
            email: null,
            loading: false
          },

          reset_password: {
            token: null,
            new_password: null,
            new_password_confirm: null,
            loading: false,
            open: false
          }
        },
      }
    },

    methods: {
      ...mapActions('auth', ['setState']),

      onSubmit() {
        this.form.loading = true
        fetch('http://localhost:4000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        })
          .then(response => {
            if (response.ok){
              return response.json()
            } else {
              if (response.status === 401){
                notifyWarning("Invalid User Credentials")
              } else if (response.status === 404) {
                notifyWarning("No user details found")
              } else {
                notifyWarning("Something Went wrong on our side, please try again.")
              }
            }
          })
          .then(data => {
            this.setState(data)
            if (this.$route.query.redirect != null) {
              this.$router.push(this.$route.query.redirect)
            } else {
              this.$router.push({name: 'dashboard'})
            }
          })
          .catch(error => {
            notifyWarning(error);
          })
          .finally(() => {
            this.form.loading = false;
          });
      },
      forgotPassword() {
        this.modals.forgot_password.loading = true

        notifyWarning("This feature is not yet implemented")

        this.modals.forgot_password.loading = false

        this.modals.forgot_password.open = false

        this.modals.reset_password.open = true
      },
      resetPassword() {
        this.modals.reset_password.loading = true


        notifyWarning("This feature is not yet implemented")

        this.modals.reset_password.open = false
      },
    }
  }
</script>

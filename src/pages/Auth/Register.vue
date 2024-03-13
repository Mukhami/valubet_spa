<template>
  <q-page
    padding
    style="max-width: 500px;"
    class="q-mx-auto"
  >
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Register</div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            outlined
            type="text"
            v-model="form.first_name"
            label="First Name *"
            hint="Your First Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            outlined
            type="text"
            v-model="form.last_name"
            label="Last Name *"
            hint="Your Last Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            outlined
            type="tel"
            v-model="form.msisdn"
            label="Your Phone Number *"
            hint="Your phone number"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type something',
            ]"
          />

          <q-input
            outlined
            type="email"
            v-model="form.email"
            label="Your email *"
            hint="Your email address"
            debounce="1000"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type something',
            ]"
          />

          <q-input
            outlined
            type="password"
            v-model="form.password"
            label="Password *"
            hint="Minimum 8 characters"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            outlined
            type="password"
            v-model="form.password_confirm"
            label="Password confirm *"
            hint="Confirm your password"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-list>
            <q-item tag="label" class="q-px-none">
              <q-item-section avatar class="q-mx-none q-px-none">
                <q-toggle v-model="form.terms"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>I accept the <a target="_blank" rel="nofollow" class="text-black text text-weight-bold"
                                              href="https://valuchainfactory.com/">Terms and
                  Conditions</a></q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" class="q-px-none">
              <q-item-section avatar class="q-mx-none q-px-none">
                <q-toggle v-model="form.privacy"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>I accept the <a target="_blank" rel="nofollow" class="text-black text text-weight-bold"
                                              href="https://valuchainfactory.com/">Privacy
                  Policy</a></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div>
            <q-btn
              no-caps
              label="Submit"
              type="submit"
              color="primary"
              unelevated
            />

            <q-btn
              class="q-ml-md"
              flat
              to="/auth/login"
              no-caps
              label="Login"
              type="submit"
              color="primary"
            />

            <q-inner-loading :showing="form.loading">
              <q-spinner-ios size="2.5rem" color="primary"/>
            </q-inner-loading>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import {notifySuccess, notifyWarning} from "../../my-helpers/helper"
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        validations: {
        },

        form: {
          first_name: null,
          last_name: null,
          email: null,
          msisdn: null,
          password: null,
          password_confirm: null,
          terms: false,
          privacy: false,
          loading: false
        },
      }
    },

    methods: {
      ...mapActions('auth', ['setState']),

      onSubmit() {
        if (!this.form.terms) {
          notifyWarning('Terms and Conditions not checked')
          return false;
        }
        if (!this.form.privacy) {
          notifyWarning('Privacy not checked')
          return false;
        }
        this.form.loading = true
        fetch('http://localhost:4000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({user: this.form}),
        })
          .then(response => {
            if (response.ok){
              return response.json()
            } else {
              notifyWarning("Something Went wrong on our side, please try again.")
            }
          })
          .then(data => {
            this.setState(data)
            if (this.$route.query.redirect != null) {
              this.$router.push(this.$route.query.redirect)
            } else {
              notifySuccess("You have been logged in successfully")
              this.$router.push({name: 'dashboard'})
            }
          })
          .catch(error => {
            notifyWarning(error);
          })
          .finally(() => {
            this.form.loading = false;
          });

      }
    }
  }
</script>

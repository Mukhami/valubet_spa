<template>
  <q-card flat>
    <q-card-section class="row justify-start q-pb-none">
      <div class="text-h6">Value Bet Users</div>
      <q-btn @click="addUser" class="q-ml-lg" size="sm" outline color="primary" label="Add New User"/>
    </q-card-section>
    <!--GAMES TABLE-->
    <q-card-section>
      <q-table
        :data="table.data"
        :columns="table.columns"
        row-key="name"
        separator="cell"
        :loading="table.loading"
        flat
      >
        <template v-slot:header-cell="props">
          <q-th :props="props" class="bg-primary text-white">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="first_name" :props="props">
              {{ props.row.first_name }}
            </q-td>
            <q-td key="last_name" :props="props">
              {{ props.row.last_name }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
            </q-td>
            <q-td key="msisdn" :props="props">
              {{ props.row.msisdn }}
            </q-td>
            <q-td key="roles" :props="props">
              {{ props.row.roles }}
            </q-td>
            <q-td key="status" :props="props">
              {{ (props.row.status === true) ? 'Active' : 'Inactive' }}
            </q-td>
            <q-td key="inserted_at" :props="props">
              {{ props.row.inserted_at }}
            </q-td>

            <q-td key="actions" :props="props">
              <q-btn
                outline
                color="secondary"
                label="View Bet History"
                size="sm"
                class="q-mr-sm"
                @click="navigateToUserBets(props.row.id)"
              />

              <q-btn
                outline
                color="warning"
                label="Edit"
                size="sm"
                @click="user(props)"
              />

              <q-btn
                outline
                color="red"
                label="Remove"
                size="sm"
                class="q-ml-sm"
                @click="remove(props)"
              />

            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <!--MODALS-->
    <!-- ADD USER -->
    <q-dialog v-model="modals.add_user.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="column items-start">
          <div class="text-h6 text-secondary q-mb-md">Add User</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="handleUserSubmit" class="q-gutter-md">
            <q-input
              outlined
              type="text"
              v-model="modals.add_user.first_name"
              label="First Name"
              hint="First Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="text"
              v-model="modals.add_user.last_name"
              label="Last Name"
              hint="Last Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="email"
              v-model="modals.add_user.email"
              label="Email"
              hint="Email"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="tel"
              v-model="modals.add_user.msisdn"
              label="Phone Number"
              hint="Phone Number"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="password"
              v-model="modals.add_user.password"
              label="Password"
              hint="Password"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-checkbox
              outlined
              v-model="modals.add_user.status"
              label="User Status"
              hint="Status (Active / Inactive)"
            />

            <q-checkbox
              outlined
              v-model="modals.add_user.is_admin"
              label="Grant Admin Role"
              hint="Assign Admin Role to User"
            />


          </q-form>
          <q-btn
            no-caps
            color="primary"
            class="full-width q-mt-md"
            type="submit"
            @click="$refs['form'].submit()"
          >
            Submit
          </q-btn>
        </q-card-section>
        <q-inner-loading :showing="modals.add_user.loading">
          <q-spinner-ios size="40px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>

    <!-- EDIT USER -->
    <q-dialog v-model="modals.edit_user.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="column items-start">
          <div class="text-h6 text-secondary q-mb-md">Edit User Details</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="editUser" class="q-gutter-md">
            <q-input
              outlined
              type="text"
              v-model="modals.edit_user.first_name"
              label="First Name"
              hint="First Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="text"
              v-model="modals.edit_user.last_name"
              label="Last Name"
              hint="Last Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="email"
              v-model="modals.edit_user.email"
              label="Email"
              hint="Email"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="tel"
              v-model="modals.edit_user.msisdn"
              label="Phone Number"
              hint="Phone Number"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-checkbox
              outlined
              v-model="modals.edit_user.status"
              label="User Status"
              hint="Status (Active / Inactive)"
            />

          </q-form>
          <q-btn
            no-caps
            color="primary"
            class="full-width q-mt-md"
            type="submit"
            @click="$refs['form'].submit()"
          >
           Submit
          </q-btn>
        </q-card-section>
        <q-inner-loading :showing="modals.edit_user.loading">
          <q-spinner-ios size="40px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>

    <!--  REMOVE USER -->
    <q-dialog v-model="modals.remove_user.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="column items-start">
          <div class="text-h6 text-secondary q-mb-md">Remove from Users List</div>
          <p class="text-primary text-bold q-mb-none text-h6">{{ modals.remove_user.first_name }}</p>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="removeUser" class="q-gutter-md">
            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.remove_user.first_name"
              label="First Name"
              hint="First Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.remove_user.last_name"
              label="Last Name"
              hint="Last Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.remove_user.email"
              label="Email"
              hint="Email"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.remove_user.msisdn"
              label="Phone Number"
              hint="Phone Number"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <p class="text-primary text-bold q-mb-none text-center">
              Confirm removal of {{ modals.remove_user.first_name }} from your Users List
            </p>

          </q-form>
          <q-btn
            no-caps
            color="primary"
            class="full-width q-mt-md"
            type="submit"
            @click="$refs['form'].submit()"
          >
            Confirm
          </q-btn>
        </q-card-section>
        <q-inner-loading :showing="modals.remove_user.loading">
          <q-spinner-ios size="40px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import {defaultMixin} from '../../../mixins/mixins'
import {notifySuccess, notifyWarning} from "../../../my-helpers/helper";
import {mapActions} from "vuex";

export default {
  name: 'Users',
  mixins: [defaultMixin],

  data() {
    return {
      modals: {
        edit_user: {
          open: false,
          loading: false,
          first_name: null,
          last_name: null,
          email: null,
          msisdn: null,
          roles: null,
          status: null,
          inserted_at: null,
          id: null,
        },

        add_user: {
          open: false,
          loading: false,
          first_name: null,
          last_name: null,
          email: null,
          msisdn: null,
          password: null,
          roles: null,
          status: null,
          is_admin: null,
          inserted_at: null,
          id: null,
        },

        remove_user: {
          open: false,
          loading: false,
          first_name: null,
          last_name: null,
          email: null,
          msisdn: null,
          status: null,
          id: null,
        }
      },
      table: {
        columns: [
          {name: 'id', align: 'left', label: '#', field: 'id', sortable: true},
          {name: 'first_name', align: 'left', label: 'First Name', field: 'first_name', sortable: true},
          {name: 'last_name', align: 'left', label: 'Last Name', field: 'last_name', sortable: true},
          {name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true},
          {name: 'msisdn', align: 'left', label: 'Phone Number', field: 'msisdn', sortable: true},
          {name: 'roles', align: 'left', label: 'Roles', field: 'roles', sortable: true},
          {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
          {name: 'inserted_at', align: 'left', label: 'Date Created', field: 'inserted_at', sortable: true},
          {name: 'actions', align: 'left', label: '', field: 'actions', sortable: false},
        ],
        data: [],
        toggle: false,
        loading: false
      },
    }
  },

  created() {
    this.getUsers()
  },

  methods: {
    ...mapActions('auth', ['clearState']),
    addUser(){
      this.modals.add_user.first_name = null
      this.modals.add_user.last_name = null
      this.modals.add_user.email = null
      this.modals.add_user.msisdn = null
      this.modals.add_user.status = null
      this.modals.add_user.is_admin = null
      this.modals.add_user.password = null
      this.modals.add_user.open = true
    },
    user(props) {
      this.modals.edit_user.open = true
      this.modals.edit_user.id = props.row.id
      this.modals.edit_user.first_name = props.row.first_name
      this.modals.edit_user.last_name = props.row.last_name
      this.modals.edit_user.email = props.row.email
      this.modals.edit_user.msisdn = props.row.msisdn
      this.modals.edit_user.roles = props.row.roles
      this.modals.edit_user.status = props.row.status
    },
    remove(props) {
      this.modals.remove_user.open = true
      this.modals.remove_user.id = props.row.id
      this.modals.remove_user.first_name = props.row.first_name
      this.modals.remove_user.last_name = props.row.last_name
      this.modals.remove_user.email = props.row.email
      this.modals.remove_user.msisdn = props.row.msisdn
      this.modals.remove_user.status = (props.row.status === true) ? 'Active' : 'Inactive'
    },
    handleUserSubmit(){
      this.modals.add_user.loading = true
      fetch(`${this.baseURL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        },
        body: JSON.stringify({ user: this.modals.add_user }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error adding user details');
          }
          notifySuccess('User Details have been added successfully');
          this.getUsers();
        })
        .catch(error => {
          notifyWarning(error.message);
        })
        .finally(() => {
          this.modals.add_user.loading = false;
          this.modals.add_user.open = false;
        });
    },
    editUser() {
      this.modals.edit_user.loading = true
      fetch(`${this.baseURL}/users/${this.modals.edit_user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        },
        body: JSON.stringify({ user: this.modals.edit_user }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error editing game details');
          }
          notifySuccess('Game Details have been edited successfully');
          this.getUsers();
        })
        .catch(error => {
          notifyWarning(error.message);
        })
        .finally(() => {
          this.modals.edit_user.loading = false;
          this.modals.edit_user.open = false;
        });
    },
    removeUser() {
      this.modals.remove_user.loading = true
      fetch(`${this.baseURL}/users/${this.modals.remove_user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error editing game details');
          }
          notifySuccess('User Details have been deleted successfully');
          this.getUsers();
        })
        .catch(error => {
          notifyWarning('Sorry Something went wrong on our side, please try again');
        })
        .finally(() => {
          this.modals.remove_user.loading = false;
          this.modals.remove_user.open = false;
        });

    },
    getUsers() {
      this.table.loading = true
      fetch(`${this.baseURL}/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.table.data = data.data.map(user => ({
            id : user.id,
            first_name : user.first_name,
            last_name : user.last_name,
            email : user.email,
            msisdn : user.msisdn,
            roles : user.roles,
            status : user.status,
            inserted_at : user.inserted_at,
          }));
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
    navigateToUserBets(id) {
      this.$router.push({ name: 'dashboard.user-bets', params: { id: id } });
    }
  }
}
</script>

<style scoped>

</style>

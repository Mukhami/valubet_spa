<template>
  <q-card flat>
    <q-card-section class="row justify-start q-pb-none">
      <div class="text-h6">ValueBet User Bets</div>
    </q-card-section>

<!--    USER DETAILS   -->
    <q-card-section class="mt-6">
      <div class="text-h6">User Details</div>
      <q-table
        :data="userTable.data"
        :columns="userTable.columns"
        row-key="name"
        separator="cell"
        :loading="userTable.loading"
        flat
        hide-bottom
      >
        <template v-slot:header-cell="props">
          <q-th :props="props" class="bg-primary text-white">
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
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
          </q-tr>
        </template>
      </q-table>
    </q-card-section>


    <!--GAME BETS TABLE-->
    <q-card-section>
      <div class="text-h6">Bets Placed</div>
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
            <q-td key="home_team" :props="props">
              {{ props.row.home_team }} <br>
              <span class="text-accent">
                <small>
                 x {{ props.row.home_odds }}
                </small>
              </span>
            </q-td>
            <q-td key="away_team" :props="props">
              {{ props.row.away_team }} <br>
              <span class="text-primary">
                <small>
                 x {{ props.row.away_odds }}
                </small>
              </span>
            </q-td>
            <q-td key="amount" :props="props">
              {{ 'KES' + props.row.amount }}
            </q-td>
            <q-td key="selection" :props="props">
              {{ props.row.selection }}
            </q-td>
            <q-td key="result" :props="props">
              {{ props.row.result }}
            </q-td>
            <q-td key="status" :props="props">
              {{ (props.row.status === true) ? 'Active' : 'Cancelled' }}
            </q-td>
            <q-td key="result_status" :props="props">
              {{ props.row.result_status }}
            </q-td>
            <q-td key="scheduled_at" :props="props">
              {{ props.row.scheduled_at }}
            </q-td>
            <q-td key="inserted_at" :props="props">
              {{ props.row.inserted_at }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn
                outline
                color="red"
                label="Cancel"
                size="sm"
                class="q-ml-sm"
                @click="cancel(props)"
              />

            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <!--MODALS-->
    <!--  REMOVE BET -->
    <q-dialog v-model="modals.cancel_bet.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="column items-start">
          <div class="text-h6 text-secondary q-mb-md">Remove from User Bets List</div>
          <p class="text-primary text-bold q-mb-none text-h6">{{ modals.cancel_bet.home_team + ' vs ' + modals.cancel_bet.away_team }}</p>
          <p class="text-primary text-bold q-mb-none text-h6">{{' At: ' + modals.cancel_bet.scheduled_at }}</p>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="cancelBet" class="q-gutter-md">
            <p class="text-primary text-bold q-mb-none text-center">
              Confirm Bet Cancellation
            </p>
          </q-form>
          <q-btn
            no-caps
            color="negative"
            class="full-width q-mt-md"
            type="submit"
            @click="$refs['form'].submit()"
          >
            Confirm
          </q-btn>
        </q-card-section>
        <q-inner-loading :showing="modals.cancel_bet.loading">
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
  name: 'UserBets',
  mixins: [defaultMixin],
  data() {
    return {
      user: null,
      modals: {
        cancel_bet: {
          open: false,
          loading: false,
          id: null,
          status: null,
          scheduled_at: null,
          result: null,
          selection: null,
        }
      },
      table: {
        columns: [
          {name: 'id', align: 'left', label: '#', field: 'id', sortable: true},
          {name: 'home_team', align: 'left', label: 'Home Team', field: 'home_team', sortable: false},
          {name: 'away_team', align: 'left', label: 'Away Team', field: 'away_team', sortable: false},
          {name: 'amount', align: 'left', label: 'Bet Amount (KES)', field: 'amount', sortable: true},
          {name: 'selection', align: 'left', label: 'Selection', field: 'selection', sortable: true},
          {name: 'result', align: 'left', label: 'Game Result', field: 'result', sortable: true},
          {name: 'status', align: 'left', label: 'Bet Status', field: 'status', sortable: true},
          {name: 'result_status', align: 'left', label: 'Bet Result', field: 'result_status', sortable: true},
          {name: 'scheduled_at', align: 'left', label: 'Scheduled At', field: 'scheduled_at', sortable: true},
          {name: 'inserted_at', align: 'left', label: 'Date Created', field: 'inserted_at', sortable: true},
          {name: 'actions', align: 'left', label: '', field: 'actions', sortable: false},
        ],
        data: [],
        toggle: false,
        loading: false
      },
      userTable: {
        columns: [
          {name: 'first_name', align: 'left', label: 'First Name', field: 'first_name', sortable: false},
          {name: 'last_name', align: 'left', label: 'Last Name', field: 'last_name', sortable: false},
          {name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true},
          {name: 'msisdn', align: 'left', label: 'Phone Number', field: 'msisdn', sortable: true},
        ],
        data: [],
        toggle: false,
        loading: false
      },
    }
  },
  methods: {
    ...mapActions('auth', ['clearState']),
    cancel(props) {
      this.modals.cancel_bet.open = true
      this.modals.cancel_bet.id = props.row.id
      this.modals.cancel_bet.status = props.row.status
      this.modals.cancel_bet.scheduled_at = props.row.scheduled_at
      this.modals.cancel_bet.result = props.row.result
      this.modals.cancel_bet.selection = props.row.selection
      this.modals.cancel_bet.home_team = props.row.home_team
      this.modals.cancel_bet.away_team = props.row.away_team
    },
    cancelBet() {
      this.modals.cancel_bet.loading = true
      if (new Date(this.modals.cancel_bet.scheduled_at) < new Date()){
        notifyWarning('Sorry you cannot cancel a bet whose game gas already been played.');
        this.modals.cancel_bet.loading = false;
        this.modals.cancel_bet.open = false;
        return
      }
      if (this.modals.cancel_bet.status === false){
        notifyWarning('This bet has already been cancelled');
        this.modals.cancel_bet.loading = false;
        this.modals.cancel_bet.open = false;
        return
      }
      fetch(`${this.baseURL}/bets/${this.modals.cancel_bet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        },
        body: JSON.stringify({ bet: {
          status: false
        } }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error editing game details');
          }
          notifySuccess('Bet has been cancelled successfully');
          this.getUserBets();
        })
        .catch(error => {
          notifyWarning('Sorry Something went wrong on our side, please try again');
        })
        .finally(() => {
          this.modals.cancel_bet.loading = false;
          this.modals.cancel_bet.open = false;
        });

    },
    getUser(userId) {
      this.table.loading = true
      fetch(`${this.baseURL}/users/${userId}`, {
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
          this.user = data.data

          this.userTable.data = [{
            id : data.data.id,
            first_name : data.data.first_name,
            last_name : data.data.last_name,
            email : data.data.email,
            msisdn : data.data.msisdn
          }]

          this.getUserBets()
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
    getUserBets() {
      this.table.loading = true
      fetch(`${this.baseURL}/bets/fetch-by-user/${this.user.id}`, {
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
          this.table.data = data.data.map(bet => ({
            id : bet.id,
            home_team : bet.game.home_team,
            home_odds : bet.game.home_odds,
            away_team : bet.game.away_team,
            away_odds : bet.game.away_odds,
            draw_odds : bet.game.draw_odds,
            result : bet.game.result,
            scheduled_at : bet.game.scheduled_at,
            amount : bet.amount,
            selection : bet.selection,
            status : bet.status,
            result_status : bet.result_status,
            inserted_at : bet.inserted_at
          }));
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
  },
  mounted() {
    if (this.$route.params.id){
      this.getUser(this.$route.params.id)
    } else {
      this.getUser(this.user_id)
    }
  }
}
</script>

<style scoped>

</style>

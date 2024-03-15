<template>
  <q-card flat>
    <q-card-section class="row justify-start q-pb-none">
      <div class="text-h6">Value Bet Games</div>
      <q-btn v-if="isAdmin" @click="addGame" class="q-ml-lg" size="sm" outline color="primary" label="Add New Game"/>
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
            <q-td key="home_team" :props="props">
              {{ props.row.home_team }}
            </q-td>
            <q-td key="home_odds" :props="props">
              {{ props.row.home_odds }}
            </q-td>
            <q-td key="away_team" :props="props">
              {{ props.row.away_team }}
            </q-td>
            <q-td key="away_odds" :props="props">
              {{ props.row.away_odds }}
            </q-td>
            <q-td key="draw_odds" :props="props">
              {{ props.row.draw_odds }}
            </q-td>
            <q-td key="result" :props="props">
              {{ props.row.result }}
            </q-td>
            <q-td key="scheduled_at" :props="props">
              {{ props.row.scheduled_at }}
            </q-td>
            <q-td key="inserted_at" :props="props">
              {{ props.row.inserted_at }}
            </q-td>

            <q-td key="actions" :props="props">
              <q-btn
                v-if="isUser"
                outline
                color="primary"
                label="Place Bet"
                size="sm"
                @click="bet(props)"
              />

              <q-btn
                v-if="isAdmin"
                outline
                color="warning"
                label="Edit"
                size="sm"
                class="q-ml-sm"
                @click="game(props)"
              />

              <q-btn
                v-if="isAdmin"
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
    <!-- PLACE BET -->
    <q-dialog v-model="modals.place_bet.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="column items-start">
          <div class="text-h6 text-secondary q-mb-md">Edit Game Details</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="placeBet" class="q-gutter-md">
            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.place_bet.home_team"
              label="Home Team"
              hint="Home Team"
            />
            <q-input
              outlined
              readonly
              type="number"
              step="0.01"
              v-model="modals.place_bet.home_odds"
              label="Home Odds"
              hint="Home Odds"
            />
            <q-input
              outlined
              readonly
              type="text"
              v-model="modals.place_bet.away_team"
              label="Away Team"
              hint="Away Team"
            />
            <q-input
              outlined
              readonly
              type="number"
              step="0.01"
              v-model="modals.place_bet.away_odds"
              label="Away Odds"
              hint="Away Odds"
            />
            <q-input
              outlined
              readonly
              type="number"
              step="0.01"
              v-model="modals.place_bet.draw_odds"
              label="Draw Odds"
              hint="Draw Odds"
            />
            <q-select
              filled
              v-model="modals.place_bet.selection"
              :options="modals.place_bet.options"
              label="Your Pick"
              hint="Selected Pick"
              emit-value
              map-options
            >
              <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                <q-item
                  v-bind="itemProps"
                  v-on="itemEvents">
                  <q-item-section>
                    <q-item-label  v-html="opt.label" ></q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle  :value="selected" @input="toggleOption(opt)" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              outlined
              @input="calculatePossibleWin"
              type="number"
              v-model="modals.place_bet.amount"
              label="Bet Amount (KES)"
              hint="Bet Amount (KES)"
              :min="1"
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              readonly
              type="number"
              v-model="possible_win"
              label="Winnings (KES)"
              hint="Winnings (KES)"
              :min="0"
            />

          </q-form>
          <q-btn
            no-caps
            color="primary"
            class="full-width q-mt-md"
            type="submit"
            @click="$refs['form'].submit()"
          >
            Place Bet
          </q-btn>
        </q-card-section>
        <q-inner-loading :showing="modals.place_bet.loading">
          <q-spinner-ios size="40px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>

    <!-- ADD GAME MODAL-->
    <q-dialog v-model="modals.add_game.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="row items-center bg-grey-3">
          <div>
            <div class="text-h6 text-primary">Create Game</div>
          </div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitGame" class="q-gutter-md">
            <q-input
              outlined
              type="text"
              v-model="modals.add_game.home_team"
              label="Home Team"
              hint="Home Team"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="number"
              step="0.01"
              v-model="modals.add_game.home_odds"
              label="Home Odds"
              hint="Home Odds"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="text"
              v-model="modals.add_game.away_team"
              label="Away Team"
              hint="Away Team"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="number"
              step="0.01"
              v-model="modals.add_game.away_odds"
              label="Away Odds"
              hint="Away Odds"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="number"
              step="0.01"
              v-model="modals.add_game.draw_odds"
              label="Draw Odds"
              hint="Draw Odds"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="date"
              v-model="modals.add_game.scheduled_at_date"
              label="Scheduled At"
              hint="Scheduled At"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="time"
              v-model="modals.add_game.scheduled_at_time"
              label="Scheduled At Time"
              hint="Scheduled At Time"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <div class="q-py-md">
              <q-btn
                unelevated
                no-caps
                type="submit"
                color="primary"
              >Submit
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
        <q-inner-loading :showing="modals.add_game.loading">
          <q-spinner-ios size="3.5em" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>
    <!-- EDIT GAME -->
    <q-dialog v-model="modals.edit_game.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="column items-start">
          <div class="text-h6 text-secondary q-mb-md">Edit Game Details</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="editGame" class="q-gutter-md">
            <q-input
              outlined
              type="text"
              v-model="modals.edit_game.home_team"
              label="Home Team"
              hint="Home Team"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="number"
              step="0.01"
              v-model="modals.edit_game.home_odds"
              label="Home Odds"
              hint="Home Odds"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="text"
              v-model="modals.edit_game.away_team"
              label="Away Team"
              hint="Away Team"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="number"
              step="0.01"
              v-model="modals.edit_game.away_odds"
              label="Away Odds"
              hint="Away Odds"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              type="number"
              step="0.01"
              v-model="modals.edit_game.draw_odds"
              label="Draw Odds"
              hint="Draw Odds"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              outlined
              readonly
              type="text"
              v-model="modals.edit_game.result"
              label="Result"
              hint="Result"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="date"
              v-model="modals.edit_game.scheduled_at_date"
              label="Scheduled At"
              hint="Scheduled At"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="time"
              v-model="modals.edit_game.scheduled_at_time"
              label="Scheduled At Time"
              hint="Scheduled At Time"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
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
        <q-inner-loading :showing="modals.edit_game.loading">
          <q-spinner-ios size="40px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>
    <!--  REMOVE GAME -->
    <q-dialog v-model="modals.remove_game.open">
      <q-card style="width: 420px; max-width: 80vw;">
        <q-card-section class="column items-start">
          <div class="text-h6 text-secondary q-mb-md">Remove from Games List</div>
          <p class="text-primary text-bold q-mb-none text-h6">{{ modals.remove_game.home_team }}</p>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="removeGame" class="q-gutter-md">
            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.remove_game.home_team"
              label="Home Team"
              hint="Home Team"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.remove_game.away_team"
              label="Away Team"
              hint="Away Team"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              readonly
              outlined
              type="text"
              v-model="modals.remove_game.scheduled_at"
              label="Scheduled At"
              hint="Scheduled At"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <p class="text-primary text-bold q-mb-none text-center">
              Confirm removal of {{ modals.remove_game.home_team + ' vs ' + modals.remove_game.away_team }} from your Games List
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
        <q-inner-loading :showing="modals.remove_game.loading">
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
  name: 'Games',
  mixins: [defaultMixin],

  data() {
    return {
      possible_win: 0,
      modals: {
        add_game: {
          open: false,
          loading: false,
          home_team: null,
          home_odds: null,
          away_team: null,
          away_odds: null,
          draw_odds: null,
          scheduled_at: null,
          scheduled_at_date: null,
          scheduled_at_time: null,
        },
        edit_game: {
          open: false,
          loading: false,
          home_team: null,
          home_odds: null,
          away_team: null,
          away_odds: null,
          draw_odds: null,
          result: null,
          scheduled_at: null,
          scheduled_at_date: null,
          scheduled_at_time: null,
          inserted_at: null,
          id: null,
        },
        place_bet: {
          open: false,
          loading: false,
          game_id: null,
          userId: null,
          selection: null,
          amount: null,
          possible_win: 0,
          status: true,
          scheduled_at: null,
          home_team: null,
          home_odds: null,
          away_team: null,
          away_odds: null,
          draw_odds: null,
          options: [
            {value: 'home_win', label: 'Home Win'},
            {value: 'draw', label: 'Draw'},
            {value: 'away_win', label: 'Away Win'}
          ]
        },
        remove_game: {
          open: false,
          loading: false,
          home_team: null,
          scheduled_at: null,
          away_team: null,
          id: null,
        }
      },
      table: {
        columns: [
          {name: 'id', align: 'left', label: '#', field: 'id', sortable: true},
          {name: 'home_team', align: 'left', label: 'Home Team', field: 'home_team', sortable: true},
          {name: 'home_odds', align: 'left', label: 'Home Odds', field: 'home_odds', sortable: true},
          {name: 'away_team', align: 'left', label: 'Away Team', field: 'away_team', sortable: true},
          {name: 'away_odds', align: 'left', label: 'Away Odds', field: 'away_odds', sortable: true},
          {name: 'draw_odds', align: 'left', label: 'Draw Odds', field: 'draw_odds', sortable: true},
          {name: 'result', align: 'left', label: 'Result', field: 'result', sortable: true},
          {name: 'scheduled_at', align: 'left', label: 'Scheduled At', field: 'scheduled_at', sortable: true},
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
    this.getGames()
  },

  methods: {
    ...mapActions('auth', ['clearState']),
    calculatePossibleWin(){
       let possibleWin = 0
      if (this.modals.place_bet.selection === 'home_win'){
       possibleWin =  Math.ceil(this.modals.place_bet.home_odds * this.modals.place_bet.amount)
      } else if (this.modals.place_bet.selection === 'draw'){
        possibleWin =  Math.ceil(this.modals.place_bet.draw_odds * this.modals.place_bet.amount)
      } else {
        possibleWin =  Math.ceil(this.modals.place_bet.away_odds * this.modals.place_bet.amount)
      }
      this.possible_win = possibleWin
    },
    addGame(){
      this.modals.add_game.home_team = null
      this.modals.add_game.home_odds = null
      this.modals.add_game.away_team = null
      this.modals.add_game.away_odds = null
      this.modals.add_game.draw_odds = null
      this.modals.add_game.scheduled_at_date = null
      this.modals.add_game.scheduled_at_time = null
      this.modals.add_game.scheduled_at = null
      this.modals.add_game.open = true
    },
    submitGame() {
      this.modals.add_game.scheduled_at = `${this.modals.add_game.scheduled_at_date} ${this.modals.add_game.scheduled_at_time}`
      this.modals.add_game.loading = true
      fetch(`${this.baseURL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        },
        body: JSON.stringify({game: this.modals.add_game}),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to add game');
          }
          return response.json();
        })
        .then(data => {
          notifySuccess('Game details uploaded successfully');
          this.getGames();
        })
        .catch(error => {
          notifyWarning('Sorry something went wrong on our side, please try again.');
        })
        .finally(() => {
          this.modals.add_game.loading = false;
          this.modals.add_game.open = false;
        });
    },
    game(props) {
      if (props.row.result !== null){
        notifyWarning("Sorry, the game cannot be edited as it has already been played")
        return
      }
      this.modals.edit_game.open = true
      this.modals.edit_game.id = props.row.id
      this.modals.edit_game.home_team = props.row.home_team
      this.modals.edit_game.home_odds = props.row.home_odds
      this.modals.edit_game.away_team = props.row.away_team
      this.modals.edit_game.away_odds = props.row.away_odds
      this.modals.edit_game.draw_odds = props.row.draw_odds
      this.modals.edit_game.result = props.row.result
      const date = new Date(props.row.scheduled_at);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      this.modals.edit_game.scheduled_at_date = `${year}-${month}-${day}`;
      this.modals.edit_game.scheduled_at_time = `${hours}:${minutes}`;

    },
    bet(props) {
      if (props.row.result !== null){
        notifyWarning("Sorry, a bet cannot be placed on this game as it has already been played")
        return
      }
      this.modals.place_bet.open = true
      this.modals.place_bet.game_id = props.row.id
      this.modals.place_bet.user_id = this.user_id
      this.modals.place_bet.scheduled_at = props.row.scheduled_at
      this.modals.place_bet.home_team = props.row.home_team
      this.modals.place_bet.home_odds = props.row.home_odds
      this.modals.place_bet.away_team = props.row.away_team
      this.modals.place_bet.away_odds = props.row.away_odds
      this.modals.place_bet.draw_odds = props.row.draw_odds
    },
    remove(props) {
      this.modals.remove_game.open = true
      this.modals.remove_game.id = props.row.id
      this.modals.remove_game.home_team = props.row.home_team
      this.modals.remove_game.away_team = props.row.away_team
      this.modals.remove_game.scheduled_at = props.row.scheduled_at
    },
    editGame() {
      this.modals.edit_game.scheduled_at = `${this.modals.edit_game.scheduled_at_date} ${this.modals.edit_game.scheduled_at_time}`
      this.modals.edit_game.loading = true
      fetch(`${this.baseURL}/games/${this.modals.edit_game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        },
        body: JSON.stringify({ game: this.modals.edit_game }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error editing game details');
          }
          notifySuccess('Game Details have been edited successfully');
          this.getGames();
        })
        .catch(error => {
          notifyWarning(error.message);
        })
        .finally(() => {
          this.modals.edit_game.loading = false;
          this.modals.edit_game.open = false;
        });
    },


    placeBet() {
      this.modals.place_bet.loading = true
      fetch(`${this.baseURL}/bets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accessToken
        },
        body: JSON.stringify({ bet: this.modals.place_bet }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error editing game details');
          }
          notifySuccess('Your bet has been placed successfully');
          this.getGames();
        })
        .catch(error => {
          notifyWarning(error.message);
        })
        .finally(() => {
          this.modals.place_bet.amount = null;
          this.modals.place_bet.selection = null;
          this.modals.place_bet.loading = false;
          this.modals.place_bet.open = false;
        });
    },

    removeGame() {
      this.modals.remove_game.loading = true
      fetch(`${this.baseURL}/games/${this.modals.remove_game.id}`, {
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
          notifySuccess('Game Details have been deleted successfully');
          this.getGames();
        })
        .catch(error => {
          notifyWarning('Sorry Something went wrong on our side, please try again');
        })
        .finally(() => {
          this.modals.remove_game.loading = false;
          this.modals.remove_game.open = false;
        });

    },
    getGames() {
      this.table.loading = true
      fetch(`${this.baseURL}/games`, {
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
          this.table.data = data.data.map(game => ({
            id : game.id,
            home_team : game.home_team,
            home_odds : game.home_odds,
            away_team : game.away_team,
            away_odds : game.away_odds,
            draw_odds : game.draw_odds,
            result : game.result,
            scheduled_at : game.scheduled_at,
            inserted_at : game.inserted_at,
          }));
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          this.table.loading = false;
        });
    }
  }
}
</script>

<style scoped>

</style>

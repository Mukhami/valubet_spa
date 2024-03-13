import {date} from 'quasar'

export function setState(state, payload) {
  state.token = payload.access_token
  let now = new Date()
  let expiryDate = new Date(now);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  state.expires_at = expiryDate
  state.roles = payload.data.roles
  state.fname = payload.data.first_name
  state.user_id = payload.data.id
}

export function clearState(state) {
  state.token = null
  state.expires_at = null
  state.roles = null
  state.fname = null
  state.user_id = null
}

export function restoreState(state, payload) {
  Object.assign(state, payload)
}

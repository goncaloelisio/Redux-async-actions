const { configureStore } = require('@reduxjs/toolkit')
const axios = require('axios')
const thunkMeddleware = require('redux-thunk').default  // to be able to return a function insted an action

const initialState = {
  loading: false,
  users: [],
  error: '',  
}

const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST'
const FETCH_USERS_SUCCEEDED = 'FETCH_USERS_SUCCEEDED'
const FETCH_USERS_FAILED = 'FETCH_USERS_FAILED'

const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST
  }
}

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCEEDED,
    payload: users,
  }
}

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILED,
    payload: error,
  }
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,  
      }
    case FETCH_USERS_SUCCEEDED:
      return {
        loading: false,
        users: action.payload,
        error: ''  
      }
    case FETCH_USERS_FAILED:
      return {
        loading: false,
        users: [],
        error: action.payload  
      }
    default: {
      return state  
    }              
  }  
}

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest())  
    axios
    .get('https://jsonplaceholder.typicode.com/users')
    .then(res => {
      const users = res.data.map((user) => user.id)
      dispatch(fetchUsersSuccess(users))  
    })
    .catch(error => {
      //error.message
      dispatch(fetchUsersFailure(error.message))  
    })
  }  
}

const store = configureStore({reducer, middleware:[thunkMeddleware]})

store.subscribe(() => { console.log(store.getState())})
store.dispatch(fetchUsers())
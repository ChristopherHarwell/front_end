import { axiosWithAuth } from '../../utils/auth/axiosWithAuth'
import { fetchCurrentUser } from '../../api/fetchCurrentUser'

export const setDashboardData = () => async (dispatch) => {
    let total_guests = 0
    let total_clocked_in = 0
    let total_staying_the_night = 0
    let staff = []

        axiosWithAuth().get('/api/guests').then(res => {
            total_guests = res.data.results
            return axiosWithAuth().get('/api/users',{params: {role: ['staff', 'admin']}})
        }).then(res => {
            staff = res.data.payload.users
            
            return axiosWithAuth().get('/api/users', {params: {role: ['staff', 'admin'], clocked_in: true}})

        }).then(res => {
            total_clocked_in = res.data.results

            return axiosWithAuth().get('/api/users', {params: {role: 'guest', clocked_in:true}})
        }).then(res => {
            total_staying_the_night = res.data.results
            dispatch({type: 'SET_DASHBOARD_DATA', payload: {total_guests,total_clocked_in,staff,total_staying_the_night}})
        }).catch(err => {
            alert('unable to retrieve data for the dashboard')
        })
}


export const login = (user, history) => async (dispatch) => {
    dispatch({ type: "IS_LOADING" })
    try {
        const res = await axiosWithAuth().post('/api/auth/login', user)

        const { token } = res.data
        const { user: currentUser } = res.data.payload

        localStorage.setItem('token', token)

        dispatch({ type: "SET_CURRENT_USER", payload: currentUser })

        dispatch({ type: 'LOGIN' })
        history.push('/')
    } catch (error) {
        let message
        if (error.message && error.message == 'Network Error') {
            history.push('/error-page')
            dispatch({ type: "ERROR", payload: error.message })
            return
        }
        if (error.response?.status == 429) {
            message = 'too many login attempts. Please contact a staff member for further assistance'
        } else {
            message = error.response?.data.message
        }

        dispatch({ type: 'ERROR', payload: message })
    }
}

export const register = (user, history) => async (dispatch) => {
    dispatch({ type: "IS_LOADING" })

    try {
        let res = await axiosWithAuth().post('/api/auth/register', user)
        let token = res.data.token

        localStorage.setItem('token', token)
        dispatch({ type: 'REGISTER' })
        history.push('/')
    } catch (error) {
        let message
        if (error.message && error.message == 'Network Error') {
            history.push('/error-page')
            dispatch({ type: "ERROR", payload: error.message })
            return
        }
        if (error.response.status == 429) {
            message = 'too many login attempts. Please contact a staff member for further assistance'
        } else {
            message = error.response.data.message
        }

        dispatch({ type: 'ERROR', payload: message })
    }
}

export const logOut = (history) => (dispatch) => {
    localStorage.removeItem('token')
    history.push('/login')
    dispatch({ type: 'LOG_OUT' })
}

export const checkIfUserIsLoggedIn = (history) => async dispatch => {

    const token = localStorage.getItem('token')
    if (token) {
        dispatch({ type: "IS_LOADING" })
        try {
            let res = await fetchCurrentUser()
            const { user } = res.payload
            dispatch({ type: "IS_NOT_LOADING" })
            dispatch({ type: 'SET_CURRENT_USER', payload: user })
            dispatch({ type: "LOGIN" })
            history.push('/')
        } catch (error) {
            dispatch({type: "IS_NOT_LOADING"})
            history.push('/login')
        }
    }
}

export const  setCurrentUser = (user) => {
    return { type: "SET_CURRENT_USER", payload: user }
}

export const clearErrors = () => {
    return { type: "CLEAR_ERRORS" }
}

export const fetchAllUsers = () => async dispatch => {
    dispatch({ type: "IS_LOADING" })

    try {
        let res = await axiosWithAuth().get('/api/users')
        const { users } = res.data.payload
        dispatch({ type: "SET_USERS", payload: users })
    } catch (error) {
        console.log(error)
    }
}

export const fetchUserById = () => dispatch => {

}

export const updateUser = (updatedValues, userId, history) => async dispatch => {
    dispatch({ type: "IS_LOADING" })

    try {
        await axiosWithAuth().patch(`/api/users/${userId}`, updatedValues)
        history.push('/')
    } catch (error) {
        const { message } = error.response.data
        dispatch({ type: "ERROR", payload: message })
    }
}

export const deleteUser = (userId) => async dispatch => {
    dispatch({ type: "IS_LOADING" })

    try {
        await axiosWithAuth().delete(`/api/users/${userId}`)
        dispatch({ type: "DELETE_USER", payload: { id: userId } })
    } catch (error) {
        console.log('error')
    }
}
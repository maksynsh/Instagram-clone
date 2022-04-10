import firebase from 'firebase/compat/app'

export interface User {
  id: string
  username: string
  profilePicture: string
}

export type UserAuth = firebase.User | null

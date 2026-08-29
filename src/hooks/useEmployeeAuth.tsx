import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api'

interface EmployeeAuthState {
  token: string | null
  employeeId: string | null
  username: string | null
  loading: boolean
}

interface EmployeeAuthContextType extends EmployeeAuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | null>(null)

export function EmployeeAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EmployeeAuthState>({
    token: localStorage.getItem('isooko-employee-token'),
    employeeId: localStorage.getItem('isooko-employee-id'),
    username: localStorage.getItem('isooko-employee-username'),
    loading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('isooko-employee-token')
    if (!token) {
      setState(s => ({ ...s, loading: false }))
      return
    }
    api.auth.verify('employee')
      .then(res => {
        if (!res.valid || res.role !== 'employee') {
          clearEmployeeToken()
          setState({ token: null, employeeId: null, username: null, loading: false })
        } else {
          setState({
            token,
            employeeId: res.employeeId || null,
            username: res.username || null,
            loading: false,
          })
        }
      })
      .catch(() => {
        setState(s => ({ ...s, loading: false }))
      })
  }, [])

  const clearEmployeeToken = () => {
    localStorage.removeItem('isooko-employee-token')
    localStorage.removeItem('isooko-employee-id')
    localStorage.removeItem('isooko-employee-username')
  }

  const login = async (username: string, password: string) => {
    const res = await api.auth.employeeLogin(username, password)
    localStorage.setItem('isooko-employee-token', res.token)
    localStorage.setItem('isooko-employee-id', res.employeeId)
    localStorage.setItem('isooko-employee-username', res.username)
    setState({ token: res.token, employeeId: res.employeeId, username: res.username, loading: false })
  }

  const logout = () => {
    clearEmployeeToken()
    setState({ token: null, employeeId: null, username: null, loading: false })
  }

  return (
    <EmployeeAuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </EmployeeAuthContext.Provider>
  )
}

export function useEmployeeAuth() {
  const ctx = useContext(EmployeeAuthContext)
  if (!ctx) throw new Error('useEmployeeAuth must be used inside EmployeeAuthProvider')
  return ctx
}

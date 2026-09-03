import { useCallback, useState } from 'react'

export interface GeolocationResult {
  latitude: string | null
  longitude: string | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationResult>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  /**
   * Resolves the device's GPS position. Returns null when location is not
   * available/permitted so callers can degrade gracefully (attendance can
   * still be recorded without coordinates).
   */
  const getPosition = useCallback((): Promise<{ latitude: string; longitude: string } | null> => {
    return new Promise(resolve => {
      if (!('geolocation' in navigator)) {
        setState({ latitude: null, longitude: null, error: 'Geolocation not supported by this browser', loading: false })
        resolve(null)
        return
      }
      setState(s => ({ ...s, loading: true, error: null }))
      navigator.geolocation.getCurrentPosition(
        pos => {
          const latitude = pos.coords.latitude.toFixed(6)
          const longitude = pos.coords.longitude.toFixed(6)
          setState({ latitude, longitude, error: null, loading: false })
          resolve({ latitude, longitude })
        },
        err => {
          const error =
            err.code === err.PERMISSION_DENIED
              ? 'Location permission denied. Attendance will not include your position.'
              : err.code === err.POSITION_UNAVAILABLE
                ? 'Location unavailable right now.'
                : 'Timed out while getting location.'
          setState({ latitude: null, longitude: null, error, loading: false })
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
      )
    })
  }, [])

  return { ...state, getPosition }
}
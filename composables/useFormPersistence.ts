// Form Persistence Composable for ECCLIVO Telegram Mini App
// Handles saving and loading form data to/from session storage

import { watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { STORAGE_KEYS } from '~/utils/constants'

export interface PersistenceOptions {
  key?: string
  storage?: 'local' | 'session'
  debounce?: number
  excludeFields?: string[]
  onRestore?: (data: any) => void
  onSave?: (data: any) => void
}

export const useFormPersistence = <T extends object>(
  data: Ref<T>,
  options: PersistenceOptions = {}
) => {
  const {
    key = STORAGE_KEYS.OSGO_DRAFT,
    storage = 'session',
    debounce = 500,
    excludeFields = [],
    onRestore,
    onSave,
  } = options

  let saveTimeout: NodeJS.Timeout | null = null
  let stopWatcher: (() => void) | null = null

  /**
   * Get storage instance
   */
  const getStorage = (): Storage | null => {
    if (typeof window === 'undefined') return null
    return storage === 'local' ? localStorage : sessionStorage
  }

  /**
   * Save data to storage
   */
  const save = () => {
    const storageInstance = getStorage()
    if (!storageInstance) return

    try {
      // Create a copy of data without excluded fields
      const dataToSave = { ...data.value }
      excludeFields.forEach((field) => {
        delete dataToSave[field as keyof T]
      })

      const json = JSON.stringify(dataToSave)
      storageInstance.setItem(key, json)

      if (onSave) {
        onSave(dataToSave)
      }

      console.log('[FormPersistence] Data saved to', storage, 'storage:', key)
    } catch (error) {
      console.error('[FormPersistence] Error saving data:', error)
    }
  }

  /**
   * Debounced save function
   */
  const debouncedSave = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
      save()
    }, debounce)
  }

  /**
   * Load data from storage
   */
  const load = (): T | null => {
    const storageInstance = getStorage()
    if (!storageInstance) return null

    try {
      const json = storageInstance.getItem(key)
      if (!json) return null

      const parsed = JSON.parse(json) as T

      if (onRestore) {
        onRestore(parsed)
      }

      console.log('[FormPersistence] Data loaded from', storage, 'storage:', key)
      return parsed
    } catch (error) {
      console.error('[FormPersistence] Error loading data:', error)
      return null
    }
  }

  /**
   * Restore data from storage
   */
  const restore = (): boolean => {
    const loaded = load()
    if (!loaded) return false

    // Merge loaded data with current data
    Object.assign(data.value, loaded)
    return true
  }

  /**
   * Clear data from storage
   */
  const clear = () => {
    const storageInstance = getStorage()
    if (!storageInstance) return

    try {
      storageInstance.removeItem(key)
      console.log('[FormPersistence] Data cleared from', storage, 'storage:', key)
    } catch (error) {
      console.error('[FormPersistence] Error clearing data:', error)
    }
  }

  /**
   * Check if data exists in storage
   */
  const exists = (): boolean => {
    const storageInstance = getStorage()
    if (!storageInstance) return false

    return storageInstance.getItem(key) !== null
  }

  /**
   * Get storage size (in characters)
   */
  const getSize = (): number => {
    const storageInstance = getStorage()
    if (!storageInstance) return 0

    const json = storageInstance.getItem(key)
    return json ? json.length : 0
  }

  /**
   * Start auto-save (watch for changes)
   */
  const startAutoSave = () => {
    if (stopWatcher) return // Already started

    stopWatcher = watch(
      data,
      () => {
        debouncedSave()
      },
      { deep: true }
    )

    console.log('[FormPersistence] Auto-save started')
  }

  /**
   * Stop auto-save
   */
  const stopAutoSave = () => {
    if (stopWatcher) {
      stopWatcher()
      stopWatcher = null
      console.log('[FormPersistence] Auto-save stopped')
    }

    if (saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }
  }

  /**
   * Force immediate save
   */
  const flush = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }
    save()
  }

  // Auto-restore on mount
  onMounted(() => {
    restore()
    startAutoSave()
  })

  // Auto-save and cleanup on unmount
  onUnmounted(() => {
    flush() // Save any pending changes
    stopAutoSave()
  })

  return {
    save,
    load,
    restore,
    clear,
    exists,
    getSize,
    flush,
    startAutoSave,
    stopAutoSave,
  }
}

/**
 * Simple persist helper for single values
 */
export const usePersist = <T>(
  key: string,
  defaultValue: T,
  storage: 'local' | 'session' = 'local'
): [() => T, (value: T) => void, () => void] => {
  const getStorage = (): Storage | null => {
    if (typeof window === 'undefined') return null
    return storage === 'local' ? localStorage : sessionStorage
  }

  const get = (): T => {
    const storageInstance = getStorage()
    if (!storageInstance) return defaultValue

    try {
      const json = storageInstance.getItem(key)
      if (!json) return defaultValue
      return JSON.parse(json) as T
    } catch (error) {
      console.error('[Persist] Error getting value:', error)
      return defaultValue
    }
  }

  const set = (value: T) => {
    const storageInstance = getStorage()
    if (!storageInstance) return

    try {
      const json = JSON.stringify(value)
      storageInstance.setItem(key, json)
    } catch (error) {
      console.error('[Persist] Error setting value:', error)
    }
  }

  const remove = () => {
    const storageInstance = getStorage()
    if (!storageInstance) return

    try {
      storageInstance.removeItem(key)
    } catch (error) {
      console.error('[Persist] Error removing value:', error)
    }
  }

  return [get, set, remove]
}

/**
 * Clear all app data from storage
 */
export const clearAllAppData = () => {
  if (typeof window === 'undefined') return

  const keys = Object.values(STORAGE_KEYS)

  // Clear from localStorage
  keys.forEach((key) => {
    localStorage.removeItem(key)
  })

  // Clear from sessionStorage
  keys.forEach((key) => {
    sessionStorage.removeItem(key)
  })

  console.log('[FormPersistence] All app data cleared')
}

/**
 * Get total storage usage for app
 */
export const getStorageUsage = (): { local: number; session: number } => {
  if (typeof window === 'undefined') {
    return { local: 0, session: 0 }
  }

  const keys = Object.values(STORAGE_KEYS)

  let localSize = 0
  let sessionSize = 0

  keys.forEach((key) => {
    const localItem = localStorage.getItem(key)
    const sessionItem = sessionStorage.getItem(key)

    if (localItem) localSize += localItem.length
    if (sessionItem) sessionSize += sessionItem.length
  })

  return {
    local: localSize,
    session: sessionSize,
  }
}

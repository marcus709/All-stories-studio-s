import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { toast } from 'sonner'

export const SupabaseTest = () => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('_test').select('*').limit(1)
        if (error) throw error
        setIsConnected(true)
        toast.success('Successfully connected to Supabase!')
      } catch (error) {
        console.error('Supabase connection error:', error)
        toast.error('Failed to connect to Supabase. Please check your configuration.')
        setIsConnected(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4">
      <Button
        variant={isConnected ? "default" : "destructive"}
        className="gap-2"
      >
        Supabase Status: {isConnected ? 'Connected' : 'Not Connected'}
      </Button>
    </div>
  )
}
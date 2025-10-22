import { DATA_BACKEND } from '@/lib/config'
import { dataClient as mockClient } from './dataClient.mock'
import { dataClient as supabaseClient } from './dataClient.supabase'

export const dataClient = DATA_BACKEND === 'supabase' ? supabaseClient : mockClient


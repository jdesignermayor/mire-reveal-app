import { supabaseBrowser } from "../supabase/client"

export function subscribeToIllustrationById(
  illustrationId: number,
  onChange: (data: {
    id: number
    images: any | null
    process_status: string
  }) => void
) {
  const supabase = supabaseBrowser()

  console.log('subscribeToIllustrationById', illustrationId)
    const channel = supabase
    .channel(`illustration:${illustrationId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // 🔥 usa * para debug
        schema: 'public',
        table: 'tbl_illustrations',
        filter: `id=eq.${illustrationId}`,
      },
      payload => {
        console.log('🔁 Realtime payload:', payload)

        const { id, images, process_status } = payload.new as any
        onChange({ id, images, process_status })
      }
    )
    .subscribe(status => {
      console.log('📡 Channel status:', status)
    })

  return () => {
    console.log('❌ Unsubscribe illustration', illustrationId)
    supabase.removeChannel(channel)
  }
}
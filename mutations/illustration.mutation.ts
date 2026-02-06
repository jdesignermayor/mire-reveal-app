'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { useAtom } from 'jotai'
import { UIIllustrationAtom } from '@/store/ui-illustration.store'
import { ILLUSTRATION_STATUS } from '@/models/illustration.model'
import { IllustrationResponse } from '@/actions/illustrations'

type IllustrationRealtime = {
    id: number
    images: any | null
    process_status: string
}

type Illustration = Database['public']['Tables']['tbl_illustrations']['Row']

// ⬅️ Configuración clara y reusable
const PENDING_INTERVAL_MS = 3000       // polling cada 3s para PENDING
const PROCESSING_INTERVAL_MS = 9000     // polling cada 9s para PROCESSING
const MAX_UNCHANGED_POLLS = 5            // límite de 5 polls para todos los estados
const STALE_TIME_MS = 60_000            // 1 minuto
const RESUME_POLLING_AFTER_MS = 60_000  // reanudar polling después de 1 minuto

export function useIllustration(illustrationId: number) {
    const supabase = supabaseBrowser()
    const [illustrationState] = useAtom(UIIllustrationAtom)
    const lastDataRef = useRef<Illustration | null>(null)
    const unchangedCountRef = useRef(0)
    const stoppedAtRef = useRef<number | null>(null)

    // Inicializar datos desde Jotai si coincide la ilustración
    const initialData =
        illustrationState.illustration?.id === illustrationId
            ? {
                id: illustrationState.illustration.id,
                images: illustrationState.illustration.images,
                process_status: illustrationState.illustration.process_status,
            } as IllustrationRealtime
            : undefined

    const query = useQuery({
        queryKey: ['illustration', illustrationId],
        queryFn: async (): Promise<Illustration> => {
            const { data, error } = await supabase
                .from('tbl_illustrations')
                .select('*')
                .eq('id', illustrationId)
                .single()

            if (error) throw error
            return data as Illustration
        },
        initialData: initialData as Illustration | undefined,
        staleTime: STALE_TIME_MS,
        refetchInterval: (query) => {
            const data = query.state.data

            // Si no hay datos aún, usamos intervalo rápido para PENDING
            if (!data) return PENDING_INTERVAL_MS

            // Detener polling si la ilustración ya está COMPLETED
            if (data.process_status === ILLUSTRATION_STATUS.COMPLETED) return false

            // Determinar intervalo según el estado
            let intervalMs = PENDING_INTERVAL_MS
            if (data.process_status === ILLUSTRATION_STATUS.PROCESSING) {
                intervalMs = PROCESSING_INTERVAL_MS
            } else if (data.process_status === ILLUSTRATION_STATUS.PENDING) {
                intervalMs = PENDING_INTERVAL_MS
            }

            // Comparar con el último estado para detectar cambios
            if (lastDataRef.current) {
                const imagesEqual =
                    JSON.stringify(lastDataRef.current.images ?? null) ===
                    JSON.stringify(data.images ?? null)
                const statusEqual =
                    lastDataRef.current.process_status === data.process_status

                if (imagesEqual && statusEqual) {
                    unchangedCountRef.current += 1
                } else {
                    unchangedCountRef.current = 0
                }
            }

            // Guardar el estado actual
            lastDataRef.current = data

            // Determinar límite máximo según el estado
            const maxUnchangedPolls = MAX_UNCHANGED_POLLS // mismo límite para todos los estados

            // Verificar si debemos detener el polling por límite
            if (unchangedCountRef.current >= maxUnchangedPolls) {
                // Si es la primera vez que se detiene, registrar el tiempo
                if (!stoppedAtRef.current) {
                    stoppedAtRef.current = Date.now()
                }

                // Reanudar polling después de 1 minuto
                const timeSinceStopped = Date.now() - (stoppedAtRef.current || 0)
                if (timeSinceStopped >= RESUME_POLLING_AFTER_MS) {
                    unchangedCountRef.current = 0 // Resetear contador
                    stoppedAtRef.current = null // Resetear tiempo de detención
                    return intervalMs // Reanudar polling normal
                }

                return false // Seguir detenido
            }

            return intervalMs
        },
    })

    return query
}

export function generateIllustrationMutation() {
    return useMutation({
        mutationFn: async (illustration: IllustrationResponse) => {
            try {
                const res = await fetch("/api/illustration", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...illustration,
                    }),
                });

                if (!res.ok) {
                    const errorBody = await res.json().catch(() => null)
                    throw new Error(
                        errorBody?.error || "Error al generar la ilustración"
                    )
                }
                return res.json() as Promise<IllustrationResponse>;
            } catch (error) {
                throw error;
            }
        },
    });
}
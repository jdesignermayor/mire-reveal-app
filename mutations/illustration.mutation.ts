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

export type Illustration = Database['public']['Tables']['tbl_illustrations']['Row']

// ⬅️ Configuración clara y reusable
const PENDING_INTERVAL_MS = 3000        // polling cada 3s para PENDING
const PROCESSING_INTERVAL_MS = 5000     // polling cada 5s para PROCESSING
const PENDING_TIMEOUT_MS = 60_000       // si lleva 1 min en PENDING, reiniciar polling

export function useIllustration(illustrationId: number) {
    const supabase = supabaseBrowser()
    const [illustrationState] = useAtom(UIIllustrationAtom)
    const pendingStartedAtRef = useRef<number | null>(null)

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
        staleTime: 0, // always consider data stale so refetchInterval works correctly
        refetchInterval: (query) => {
            const data = query.state.data

            // Sin datos aún → polling rápido
            if (!data) return PENDING_INTERVAL_MS

            // Completado → detener polling
            if (data.process_status === ILLUSTRATION_STATUS.COMPLETED) {
                pendingStartedAtRef.current = null
                return false
            }

            // PENDING: trackear cuánto tiempo lleva en este estado
            if (data.process_status === ILLUSTRATION_STATUS.PENDING) {
                if (!pendingStartedAtRef.current) {
                    pendingStartedAtRef.current = Date.now()
                }

                const timeInPending = Date.now() - pendingStartedAtRef.current

                // Si lleva más de 1 minuto en PENDING, reiniciar el contador
                if (timeInPending >= PENDING_TIMEOUT_MS) {
                    pendingStartedAtRef.current = Date.now() // reiniciar
                }

                return PENDING_INTERVAL_MS
            }

            // PROCESSING: resetear el tracker de PENDING y usar intervalo de 5s
            if (data.process_status === ILLUSTRATION_STATUS.PROCESSING) {
                pendingStartedAtRef.current = null
                return PROCESSING_INTERVAL_MS
            }

            // Cualquier otro estado → polling rápido
            return PENDING_INTERVAL_MS
        },
    })

    return query
}

export function imageGenerationMutation() {
    return useMutation({
        mutationFn: async (illustrationId: number) => {
            try {
                const res = await fetch("/api/image-generation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        illustrationId,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchWorker } from "./fetchWorker"

const QUERY_KEY = "privateKey"

export function usePrivateKey(): [string, (key: string) => void] {
    const client = useQueryClient()

    const query = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: async () => {
            const key: string = await fetchWorker("get", "privateKey")

            return key
        }
    })

    const mutation = useMutation({
        mutationKey: [QUERY_KEY],
        mutationFn: async (key: string) => {
            await fetchWorker("set", "privateKey", key)
        },
        onSuccess: (_data, key: string) => {
            client.setQueryData([QUERY_KEY], () => key)
        }
    })

    return [query.data ?? "", (key: string) => mutation.mutate(key)]
}
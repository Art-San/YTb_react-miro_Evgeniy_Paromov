// import { rqClient } from '@/shared/api/instance'

// import { useQueryClient } from '@tanstack/react-query'
// import { useState } from 'react'

// export function useUpdateFavorite() {
//   const queryClient = useQueryClient()

//   const [favorite, setFavorite] = useState<Record<string, boolean>>({})

//   const updateFavoriteMutation = rqClient.useMutation(
//     'put',
//     '/boards/{boardId}/favorite',
//     {
//       onMutate: async ({ params, body }) => {
//         setFavorite((prev) => ({
//           ...prev,
//           [params.path.boardId]: body.isFavorite
//         }))
//       },
//       onSettled: async (data, __, { params }) => {
//         await queryClient.invalidateQueries(
//           rqClient.queryOptions('get', '/boards')
//         )
//         setFavorite((prev) => ({
//           ...prev,
//           [params.path.boardId]: data?.isFavorite ?? false
//         }))
//       }
//     }
//   )

//   const toggle = (board: { id: string; isFavorite: boolean }) =>
//     updateFavoriteMutation.mutate({
//       params: { path: { boardId: board.id } },
//       body: { isFavorite: !board.isFavorite }
//     })

//   const isOptimisticFavorite = (board: { id: string; isFavorite: boolean }) =>
//     favorite[board.id] ?? board.isFavorite
//   return { toggle, isOptimisticFavorite }
// }

//=======================

// import { rqClient } from '@/shared/api/instance'
// import { ApiSchemas } from '@/shared/api/schema'
// import { InfiniteData, useQueryClient } from '@tanstack/react-query'

// export function useUpdateFavorite() {
//   const queryClient = useQueryClient()

//   const updateFavoriteMutation = rqClient.useMutation(
//     'put',
//     '/boards/{boardId}/favorite',
//     {
//       onMutate: async ({ params, body }) => {
//         await queryClient.cancelQueries(rqClient.queryOptions('get', '/boards'))

//         queryClient.setQueriesData(
//           rqClient.queryOptions('get', '/boards'),
//           (data: InfiniteData<ApiSchemas['BoardsList']>) => {
//             console.log(56, data)
//             return {
//               ...data,
//               pages: data.pages.map((page) => ({
//                 ...page,
//                 list: page.list.map((board) =>
//                   board.id === params.path.boardId
//                     ? { ...board, isFavorite: body.isFavorite }
//                     : board
//                 )
//               }))
//             }
//           }
//         )
//       },
//       onSettled: async () => {
//         await queryClient.invalidateQueries(
//           rqClient.queryOptions('get', '/boards')
//         )
//       }
//     }
//   )

//   const toggle = (board: { id: string; isFavorite: boolean }) =>
//     updateFavoriteMutation.mutate({
//       params: { path: { boardId: board.id } },
//       body: { isFavorite: !board.isFavorite }
//     })

//   return { toggle }
// }

// =====================

import { rqClient } from '@/shared/api/instance'
import { useQueryClient } from '@tanstack/react-query'
import { startTransition, useOptimistic } from 'react'

export function useUpdateFavorite() {
  const queryClient = useQueryClient()

  const [favorite, setFavorite] = useOptimistic<Record<string, boolean>>({})

  const updateFavoriteMutation = rqClient.useMutation(
    'put',
    '/boards/{boardId}/favorite',
    {
      onSettled: async () => {
        await queryClient.invalidateQueries(
          rqClient.queryOptions('get', '/boards')
        )
      }
    }
  )

  const toggle = (board: { id: string; isFavorite: boolean }) => {
    startTransition(async () => {
      setFavorite((prev) => ({
        ...prev,
        [board.id]: !board.isFavorite
      }))
      await updateFavoriteMutation.mutateAsync({
        params: { path: { boardId: board.id } },
        body: { isFavorite: !board.isFavorite }
      })
    })
  }

  const isOptimisticFavorite = (board: { id: string; isFavorite: boolean }) =>
    favorite[board.id] ?? board.isFavorite

  return {
    toggle,
    isOptimisticFavorite
  }
}

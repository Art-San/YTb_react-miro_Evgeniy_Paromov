import { Button } from '@/shared/ui/kit/button'
import { useBoardsList } from './model/use-boards-list'
import { useBoardsFilters } from './model/use-boards-filters'
import { useDebouncedValue } from '@/shared/lib/react'
import { useCreateBoard } from './model/use-create-board'
import { useDeleteBoard } from './model/use-delete-board'
import { useUpdateFavorite } from './model/use-update-favorite'
import { PlusIcon } from 'lucide-react'
import {
  BoardsListLayout,
  BoardsListLayoutCards,
  BoardsListLayoutContent,
  BoardsListLayoutFilters,
  BoardsListLayoutHeader,
  BoardsListLayoutList
} from './ui/boards-list-layout'
import { useState } from 'react'
import { ViewMode, ViewModeToggle } from './ui/view-mode-toggle'
import { BoardsSortSelect } from './ui/boards-sort-select'
import { BoardsSearchInput } from './ui/boards-search-input'
import { BoardsListCard } from './ui/boards-list-card'

function BoardsListPage() {
  const boardsFilters = useBoardsFilters()

  const boardsQuery = useBoardsList({
    sort: boardsFilters.sort,
    search: useDebouncedValue(boardsFilters.search, 300)
  })

  const createBoard = useCreateBoard()
  const deleteBoard = useDeleteBoard()
  const updateFavorite = useUpdateFavorite()
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  return (
    <BoardsListLayout
      header={
        <BoardsListLayoutHeader
          title="Доски"
          description="Здесь вы можете просматривать и управлять своими досками"
          actions={
            <Button
              onClick={createBoard.createBoard}
              disabled={createBoard.isPending}
            >
              <PlusIcon />
              Создать доску
            </Button>
          }
        />
      }
      filters={
        <BoardsListLayoutFilters
          sort={
            <BoardsSortSelect
              value={boardsFilters.sort}
              onValueChange={boardsFilters.setSort}
            />
          }
          filters={
            <BoardsSearchInput
              value={boardsFilters.search}
              onChange={boardsFilters.setSearch}
            />
          }
          actions={
            <ViewModeToggle
              value={viewMode}
              onChange={(value) => setViewMode(value)}
            />
          }
        />
      }
    >
      <BoardsListLayoutContent
        isEmpty={boardsQuery.boards.length === 0}
        isPending={boardsQuery.isPending}
        isPendingNext={boardsQuery.isFetchingNextPage}
        cursorRef={boardsQuery.cursorRef}
        hasCursor={boardsQuery.hasNextPage}
      >
        {viewMode === 'list' ? (
          <BoardsListLayoutList>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={updateFavorite.isOptimisticFavorite(board)}
                onFavoriteToggle={() => updateFavorite.toggle(board)}
                onDelete={() => deleteBoard.deleteBoard(board.id)}
                isDeletePending={deleteBoard.getIsPending(board.id)}
              />
            ))}
          </BoardsListLayoutList>
        ) : (
          <BoardsListLayoutCards>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={updateFavorite.isOptimisticFavorite(board)}
                onFavoriteToggle={() => updateFavorite.toggle(board)}
                onDelete={() => deleteBoard.deleteBoard(board.id)}
                isDeletePending={deleteBoard.getIsPending(board.id)}
              />
            ))}
          </BoardsListLayoutCards>
        )}
      </BoardsListLayoutContent>
    </BoardsListLayout>
  )
}

export const Component = BoardsListPage

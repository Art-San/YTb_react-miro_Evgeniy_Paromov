import { useBoardsList } from './model/use-boards-list'

import { useDeleteBoard } from './model/use-delete-board'
import { useUpdateFavorite } from './model/use-update-favorite'

import {
  BoardsListLayout,
  BoardsListLayoutCards,
  BoardsListLayoutContent,
  BoardsListLayoutHeader,
  BoardsListLayoutList
} from './ui/boards-list-layout'
import { useState } from 'react'
import { ViewMode, ViewModeToggle } from './ui/view-mode-toggle'

import { BoardsListCard } from './ui/boards-list-card'

function BoardsListPage() {
  const boardsQuery = useBoardsList({
    isFavorite: true
  })

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

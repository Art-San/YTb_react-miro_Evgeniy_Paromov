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
import { BoardsFavoriteToggle } from './ui/boards-favorite-toggle'
import { Button } from '@/shared/ui/kit/button'

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
            {boardsQuery.boards.map(
              (board) =>
                updateFavorite.isOptimisticFavorite && (
                  <BoardsListCard
                    key={board.id}
                    board={board}
                    rightTopActions={
                      <BoardsFavoriteToggle
                        isFavorite={updateFavorite.isOptimisticFavorite(board)}
                        onToggle={() => updateFavorite.toggle(board)}
                      />
                    }
                    buttonActions={
                      <Button
                        variant="destructive"
                        disabled={deleteBoard.getIsPending(board.id)}
                        onClick={() => deleteBoard.deleteBoard(board.id)}
                      >
                        Удалить
                      </Button>
                    }
                  />
                )
            )}
          </BoardsListLayoutList>
        ) : (
          <BoardsListLayoutCards>
            {boardsQuery.boards.map(
              (board) =>
                updateFavorite.isOptimisticFavorite && (
                  <BoardsListCard
                    key={board.id}
                    board={board}
                    rightTopActions={
                      <BoardsFavoriteToggle
                        isFavorite={updateFavorite.isOptimisticFavorite(board)}
                        onToggle={() => updateFavorite.toggle(board)}
                      />
                    }
                    buttonActions={
                      <Button
                        variant="destructive"
                        disabled={deleteBoard.getIsPending(board.id)}
                        onClick={() => deleteBoard.deleteBoard(board.id)}
                      >
                        Удалить
                      </Button>
                    }
                  />
                )
            )}
          </BoardsListLayoutCards>
        )}
      </BoardsListLayoutContent>
    </BoardsListLayout>
  )
}

export const Component = BoardsListPage

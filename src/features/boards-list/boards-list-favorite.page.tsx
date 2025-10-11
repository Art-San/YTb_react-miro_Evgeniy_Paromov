import { useBoardsList } from './model/use-boards-list'

import {
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutHeader
} from './ui/boards-list-layout'
import { useState } from 'react'
import { ViewMode, ViewModeToggle } from './ui/view-mode-toggle'

import { BoardItem } from './compose/board-item'
import { BoardCard } from './compose/board-card'

function BoardsListPage() {
  const boardsQuery = useBoardsList({
    isFavorite: true
  })

  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // const boards = boardsQuery.boards.filter((board) =>
  //   updateFavorite.isOptimisticFavorite(board)
  // )

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
        mode={viewMode}
        renderList={() =>
          boardsQuery.boards.map((board) => <BoardItem board={board} />)
        }
        renderGrid={() =>
          boardsQuery.boards.map((board) => <BoardCard board={board} />)
        }
      />
    </BoardsListLayout>
  )
}

export const Component = BoardsListPage

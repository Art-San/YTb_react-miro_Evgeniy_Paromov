import { useBoardsList } from './model/use-boards-list'

import { useDeleteBoard } from './model/use-delete-board'

import { useUpdateFavorite } from './model/use-update-favorite'

import {
  BoardsLayoutContentGroups,
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

import { BoardsListItem } from './ui/boards-list-item'
import { useRecentGroups } from './model/use-recent-groups'
import { ApiSchemas } from '@/shared/api/schema'

function BoardsListPage() {
  const boardsQuery = useBoardsList({
    sort: 'lastOpenedAt'
  })

  const deleteBoard = useDeleteBoard()
  const updateFavorite = useUpdateFavorite()
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const boards = boardsQuery.boards.filter((board) =>
    updateFavorite.isOptimisticFavorite(board)
  )

  const recentGroups = useRecentGroups(boards)

  const renderCard = (board: ApiSchemas['Board']) => {
    return (
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
  }

  const renderItem = (board: ApiSchemas['Board']) => {
    return (
      <BoardsListItem
        key={board.id}
        board={board}
        rightActions={
          <BoardsFavoriteToggle
            isFavorite={updateFavorite.isOptimisticFavorite(board)}
            onToggle={() => updateFavorite.toggle(board)}
          />
        }
        menuActions={
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
  }

  const renderGroup = (boards: ApiSchemas['Board'][]) => {
    if (viewMode === 'list') {
      return (
        <BoardsListLayoutList>{boards.map(renderItem)}</BoardsListLayoutList>
      )
    }

    return (
      <BoardsListLayoutCards>{boards.map(renderCard)}</BoardsListLayoutCards>
    )
  }

  return (
    <BoardsListLayout
      header={
        <BoardsListLayoutHeader
          title="Последние доски"
          description="Здесь вы можете просматривать и управлять своими последними досками"
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
      />
      <BoardsLayoutContentGroups
        groups={recentGroups.map((group) => ({
          items: renderGroup(group.items),
          title: group.title
        }))}
      />
    </BoardsListLayout>
  )
}

export const Component = BoardsListPage

// import { useState } from "react";
// import { useBoardsList } from "./model/use-boards-list";

// import {
//   BoardsLayoutContentGroups,
//   BoardsListLayout,
//   BoardsListLayoutCards,
//   BoardsListLayoutContent,
//   BoardsListLayoutHeader,
//   BoardsListLayoutList,
// } from "./ui/boards-list-layout";
// import { ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";

// import { useRecentGroups } from "./model/use-recent-groups";

// import { BoardCard } from "./compose/board-card";
// import { BoardItem } from "./compose/board-item";
// import { BoardsSidebar } from "./ui/boards-sidebar";

// function BoardsListPage() {
//   const boardsQuery = useBoardsList({
//     sort: "lastOpenedAt",
//   });

//   const [viewMode, setViewMode] = useState<ViewMode>("list");

//   const recentGroups = useRecentGroups(boardsQuery.boards);

//   return (
//     <BoardsListLayout
//       sidebar={<BoardsSidebar />}
//       header={
//         <BoardsListLayoutHeader
//           title="Последние доски"
//           description="Здесь вы можете просматривать и управлять своими последними досками"
//           actions={
//             <ViewModeToggle
//               value={viewMode}
//               onChange={(value) => setViewMode(value)}
//             />
//           }
//         />
//       }
//     >
//       <BoardsListLayoutContent
//         isEmpty={boardsQuery.boards.length === 0}
//         isPending={boardsQuery.isPending}
//         isPendingNext={boardsQuery.isFetchingNextPage}
//         cursorRef={boardsQuery.cursorRef}
//         hasCursor={boardsQuery.hasNextPage}
//         mode={viewMode}
//       >
//         <BoardsLayoutContentGroups
//           groups={recentGroups.map((group) => ({
//             items: {
//               list: (
//                 <BoardsListLayoutList>
//                   {group.items.map((board) => (
//                     <BoardItem board={board} />
//                   ))}
//                 </BoardsListLayoutList>
//               ),
//               cards: (
//                 <BoardsListLayoutCards>
//                   {group.items.map((board) => (
//                     <BoardCard board={board} />
//                   ))}
//                 </BoardsListLayoutCards>
//               ),
//             }[viewMode],
//             title: group.title,
//           }))}
//         />
//       </BoardsListLayoutContent>
//     </BoardsListLayout>
//   );
// }

// export const Component = BoardsListPage;

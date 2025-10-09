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
  BoardsListLayoutHeader
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
            // <Select
            //   value={boardsFilters.sort}
            //   onValueChange={(value) =>
            //     boardsFilters.setSort(value as BoardsSortOption)
            //   }
            // >
            //   <SelectTrigger id="sort" className="w-full">
            //     <SelectValue placeholder="Сортировка" />
            //   </SelectTrigger>
            //   <SelectContent>
            //     <SelectItem value="lastOpenedAt">По дате открытия</SelectItem>
            //     <SelectItem value="createdAt">По дате создания</SelectItem>
            //     <SelectItem value="updatedAt">По дате обновления</SelectItem>
            //     <SelectItem value="name">По имени</SelectItem>
            //   </SelectContent>
            // </Select>
          }
          filters={
            <BoardsSearchInput
              value={boardsFilters.search}
              onChange={boardsFilters.setSearch}
            />

            // <Input
            //   id="search"
            //   placeholder="Введите название доски..."
            //   value={boardsFilters.search}
            //   onChange={(e) => boardsFilters.setSearch(e.target.value)}
            //   className="w-full"
            // />
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
          <BoardsListLayoutCards>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={board.isFavorite}
                onFavoriteToggle={() =>
                  updateFavorite.isOptimisticFavorite(board)
                }
                onDelete={() => deleteBoard.deleteBoard(board.id)}
                isDeletePending={deleteBoard.getIsPending(board.id)}
              />
            ))}
          </BoardsListLayoutCards>
        ) : (
          <BoardsListLayoutCards>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={board.isFavorite}
                onFavoriteToggle={() =>
                  updateFavorite.isOptimisticFavorite(board)
                }
                onDelete={() => deleteBoard.deleteBoard(board.id)}
                isDeletePending={deleteBoard.getIsPending(board.id)}
              />
            ))}
          </BoardsListLayoutCards>
        )}
      </BoardsListLayoutContent>
      {/* {boardsQuery.isPending ? (
        <div className="text-center py-10">Загрузка...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardsQuery.boards.map((board) => (
              <Card key={board.id} className="relative">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    <StarIcon />
                  </span>
                  <Switch
                    checked={updateFavorite.isOptimisticFavorite(board)}
                    onCheckedChange={() => updateFavorite.toggle(board)}
                  />
                </div>
                <CardHeader>
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="link"
                      className="text-left justify-start h-auto p-0"
                    >
                      <Link to={href(ROUTES.BOARD, { boardId: board.id })}>
                        <span className="text-xl font-medium">
                          {board.name}
                        </span>
                      </Link>
                    </Button>
                    <div className="text-sm text-gray-500">
                      Создано: {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Последнее открытие:{' '}
                      {new Date(board.lastOpenedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="destructive"
                    disabled={deleteBoard.getIsPending(board.id)}
                    onClick={() => deleteBoard.deleteBoard(board.id)}
                  >
                    Удалить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {boardsQuery.boards.length === 0 && !boardsQuery.isPending && (
            <div className="text-center py-10">Доски не найдены</div>
          )}

          {boardsQuery.hasNextPage && (
            <div ref={boardsQuery.cursorRef} className="text-center py-8">
              {boardsQuery.isPending && 'Загрузка дополнительных досок...'}
            </div>
          )}
        </>
      )} */}
    </BoardsListLayout>
  )
}

export const Component = BoardsListPage

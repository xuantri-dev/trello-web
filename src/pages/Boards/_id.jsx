import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

// import { mockData } from "~/apis/mock-data";
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  // Không dùng State của component nữa mà dùng State của Redux
  // const [board, setBoard] = useState(null);
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)

  const { boardId } = useParams()

  useEffect(() => {

    // call api
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  /**
   * Function này có nhiệm vụ gọi API và xử lí khi kéo thả Column xong xuôi
   * Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong Board)
   */
  const moveColumns = (dndOrderedColumns) => {
    // update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    /**
     * Trong trường hợp dùng Spread Operator thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi api update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  /**
   * Khi di chuyển card trong cùng Column:
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
   */
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // update cho chuẩn dữ liệu state Board

    /**
     * Cannot assign to read only property 'cards' of object
     * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only - (nested object - can thiệp sâu dữ liệu)
     */
    // const newBoard = { ...board };
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi api update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /*
  Khi di chuyển card sang Column khác:
  B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
  B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm cái _id của Card vào mảng)
  B3: Câp nhật lại trường columnId mới của cái Card đã kéo
  => Làm 1 API support riêng
  */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }

    // Tương tự đoạn xử lí chỗ hàm moveColumns nên không ảnh hưởng Redux Immutability gì ở đây cả
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lí phía BE
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds
    // Xử lí vấn đề khi kéo Card cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder card, cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE (vid 37.2)
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds
    })
  }


  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng/mở theo điều kiện có tồn tại data activeCard lưu trong Redux hay không thì mới render. Mỗi thời điểm chỉ tồn tại một cái Modal Card đang Active */}
      {activeCard && <ActiveCard />}

      {/* Các thành phần còn lại của Board Details */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}

        // 3 trường hợp move dưới đây thì giữ nguyên để code xử lí kéo thả ở phần BoardContent không bị quá dài mất kiểm soát khi đọc code, maintain
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board

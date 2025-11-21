import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mapOrder } from "~/utils/sorts";

// import { mockData } from "~/apis/mock-data";
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis";
import { generatePlaceholderCard } from "~/utils/formatters";
import { isEmpty } from "lodash";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // tạm thời fix cứng boardId, flow chuẩn chỉnh về sau sẽ sử dụng react-router-dom để lấy boardId từ URL về
    const boardId = "68dd328053a2c1b1e7949ca6";

    // call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      // sắp xếp thứ tự các các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các components con (vid 71 đã giải thích lí do ở phần fix bug quan trọng)
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        // khi f5 trang web thì cần xử lí vấn đề kéo thả vào một column rỗng (xem lại vid 37.2, code hiện tại là vid 69)
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          // sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các components con (vid 71 đã giải thích lí do ở phần fix bug quan trọng)
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id");
        }
      });
      setBoard(board);
    });
  }, []);

  // function này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    // khi tạo column mới thì nó sẽ chưa có card, cần xử lí vấn đề kéo thả vào một column rỗng (xem lại vid 37.2, code hiện tại là vid 69)
    createdColumn.card = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    // cập nhật state board
    // phía FE phải tự làm đúng lại state data board (thay vì phải gọi lại fetchBoardDetailsAPI)
    // lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù của dự án, có nơi BE sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là API tạo Column hay Card đi chăng nữa => lúc này FE sẽ nhàn hơn
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  // function này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    // cập nhật state card
    // phía FE phải tự làm đúng lại state data board (thay vì phải gọi lại fetchBoardDetailsAPI)
    // lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù của dự án, có nơi BE sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là API tạo Column hay Card đi chăng nữa => lúc này FE sẽ nhàn hơn
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );

    if (columnToUpdate) {
      // Nếu column rỗng: Bản chất là đang chứa một cái placeholder card (nhớ lại vid 37.2, hiện tại là vid 69)
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        // ngược lại column đã có data thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }
    setBoard(newBoard);
  };

  /**
   * Function này có nhiệm vụ gọi API và xử lí khi kéo thả Column xong xuôi
   * Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong Board)
   */
  const moveColumns = (dndOrderedColumns) => {
    // update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Gọi api update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

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
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);

    // Gọi api update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  };

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
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Gọi API xử lí phía BE
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds;
    // Xử lí vấn đề khi kéo Card cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder card, cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE (vid 37.2)
    if (prevCardOrderIds[0].includes("placeholder-card")) prevCardOrderIds = [];

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    });
  };

  if (!board)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    );

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;

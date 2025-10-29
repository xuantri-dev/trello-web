import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";

// import { mockData } from "~/apis/mock-data";
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
} from "~/apis";
import { generatePlaceholderCard } from "~/utils/formatters";
import { isEmpty } from "lodash";

function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // tạm thời fix cứng boardId, flow chuẩn chỉnh về sau sẽ sử dụng react-router-dom để lấy boardId từ URL về
    const boardId = "68dd328053a2c1b1e7949ca6";

    // call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      // khi f5 trang web thì cần xử lí vấn đề kéo thả vào một column rỗng (xem lại vid 37.2, code hiện tại là vid 69)
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
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
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id);
    }
    setBoard(newBoard);
  };

  // function này có nhiệm vụ gọi API và xử lí khi kéo thả Column xong xuôi
  const moveColumns = async (dndOrderedColumns) => {
    // update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Gọi api update board
    await updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  );
}

export default Board;

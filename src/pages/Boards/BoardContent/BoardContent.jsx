import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

function BoardContent({ board }) {
  // nếu dùng pointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở nhưng phần tử kéo thả - nhưng mà còn bug
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });

  const mouseSensor = useSensor(PointerSensor, {
    // yêu cầu chuột di chuyển 10px mới kích hoạt event, fix trường hợp click bị gọi event
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(PointerSensor, {
    // nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
    delay: 250,
    tolerance: 500,
  });

  // ưu tiên sử dụng kểt hợp 2 loại sensors là mouse và touch để có trải nghiệm mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    console.log("handleDragEnd: ", event);
    const { active, over } = event;

    // kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return;

    // nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      // lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      // dùng arrayMove của dnd-kit để sắp xếp lại các mảng Columns ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
      // console.log("dndOrderedColumns: ", dndOrderedColumns);
      // console.log("dndOrderedColumnsIds: ", dndOrderedColumnsIds);

      // cập nhật lại state column sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns);
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  );
}

export default BoardContent;

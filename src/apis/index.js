import axios from "axios";
import { API_ROOT } from "~/utils/constants";

/*  
 Lưu ý: đối với việc sử dụng axios, tất cả function ở dưới sẽ chỉ request và lấy data từ response luôn, không có try catch hay then catch gì để bắt lỗi
 Lí do là vì ở phía FE không nhất thiết phải làm như vậy đối với mọi request với nó sẽ dư thừa code catch lỗi quá nhiều
 Giải pháp clean code gọn gàng đó là sẽ catch lỗi tập trung tại một nơi bằng cách tận dụnng một thứ cực kì mạnh mẽ trong axios đó là Interceptors
 Interceptors là cách mà sẽ đánh chặn giữa request hoặc response để xử lí logic theo mong muốn
*/

/* Board */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  // axios sẽ trả kết quả về qua property của nó là data
  return response.data;
};

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  return response.data;
};

/* Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData);
  return response.data;
};

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  return response.data;
};

/* Card */
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
  return response.data;
};

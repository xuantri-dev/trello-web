import { createSlice } from '@reduxjs/toolkit'

// khởi tạo giá trị của một Slice trong Redux
const initialState = {
  currentActiveCard: null
}

// Khởi tạo một slice trong kho lưu trữ - redux store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Reducers: Nơi xử lí dữ liệu đồng bộ
  reducers: {
    // Lưu ý luôn là ở đây cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state

    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      // xử lí dữ liệu nếu cần thiết
      // ...
      // Update lại dữ liệu currentActiveCard trong Redux
      state.currentActiveCard = fullCard
    }
  },
  // ExtraReducers: Xử lí dữ liệu bất đồng bộ
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

// Action creators are generated for each case reducer function
// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties action đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo ra tự động theo tên của reducer
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

// Cái file này tên là activeCardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer
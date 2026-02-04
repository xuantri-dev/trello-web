import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị của một Slice trong Redux
const initialState = {
  currentNotifications: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    // Lưu ý: axios sẽ trả về kết quả qua property của nó là data
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

// Khởi tạo một slice trong kho lưu trữ - redux store
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  // Reducers: Nơi xủ lí dữ liệu đồng bộ
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    // Thêm mới một cái bản ghi notification vào đầu mảng currentNotifications
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      // unshift là thêm phần tử vào đầu mảng, ngược lại với push
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  // ExtraReducers: Xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      // Đoạn này ngược lại mảng invitations nhận được, đơn giản là dể hiển thị cái mới nhất lên đầu
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    })

    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      // Cập nhật lại dữ liệu boardInvitation (bên trong nó sẽ có Status mới sau khi update)
      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

// Action creators are generated for each case reducer function
// Action: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer
export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentNotifications = state => {
  return state.notifications.currentNotifications
}

// Cái file này tên là notificationsSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer, cần chú ý
// export default notificationsSlice.reducer
export const notificationsReducer = notificationsSlice.reducer
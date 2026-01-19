import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'

function BoardUserGroup({ boardUser = [], limit = 8 }) {
  /**
   * Xử lí Popover để ẩn hoặc hiện toàn bộ user trên một cái popup, tương tự dóc để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, serAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) serAnchorPopoverElement(event.currentTarget)
    else serAnchorPopoverElement(null)
  }

  // Lưu ý ở đây chúng ta không dùng Component AvatarGroup của MUI bới nó không hỗ trợ tốt trong việc chúng ta cần custom & trigger xử lí phần tử tính toán cuối, đơn gảin là cứ dùng Box và CSS Style đám Avatar cho chuẩn kết hợp tính toán một chút thôi
  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {[...Array(16)].map((_, index) => {
        if (index < limit) {
          return (
            <Tooltip title="xuantridev" key={index}>
              <Avatar
                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                alt='xuantridev'
                src='https://res.cloudinary.com/xuantridev/image/upload/v1767886192/users/bw5ixgn2ir1mryuuv5bl.jpg'
              />
            </Tooltip>
          )
        }
      })}

      {/* Nếu số lượng users nhiều hơn limit thì hiện thêm +number */}
      {[...Array(16)].length > limit &&
        <Tooltip title="Show more">
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{[...Array(16)].length - limit}
          </Box>
        </Tooltip>
      }

      {/* Khi click vào +number ở trên thì sẽ mở popover hiện toàn bộ users, sẽ không limit nữa */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '235px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[...Array(16)].map((_, index) =>
            <Tooltip title="xuantridev" key={index}>
              <Avatar
                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                alt='xuantridev'
                src='https://res.cloudinary.com/xuantridev/image/upload/v1767886192/users/bw5ixgn2ir1mryuuv5bl.jpg'
              />
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup
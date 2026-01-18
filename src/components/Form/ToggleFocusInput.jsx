import { useState } from 'react'
import TextField from '@mui/material/TextField'

// Một trick xử lí css khá hay trong việc làm UI UX khi cần ẩn hiện một cái input: Hiểu đơn giản là thay vì phải tạo biến State để chuyển đổi qua lại giữa thẻ Input và Text thông thường thì chúng ta sẽ CSS lại cho cái thẻ Input trông như text bình thường, chỉ khi click và focus vào nó thì style lại trở lại cái input ban đầu.
// Controller Input trong MUI: https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
function ToggleFocusInput({ value, onChangedValue, inputFontSize = '16px', ...props }) {
  const [inputValue, setInputValue] = useState(value)

  // Blur khi chúng ta không còn Focus vào phần tử nữa thì sẽ trigger hành động ở đây
  const triggerBlur = () => {
    // Suport Trim cái dữ liệu State inputValue cho đẹp luôn sau khi blur ra ngoài
    setInputValue(inputValue.trim())

    // Nếu giá trị không có gì thay đổi hoặc nếu user xóa hết nội dung thì set lại giá trị gốc từ props và return luôn không làm gì thêm
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }

    // console.log('value: ', value)
    // console.log('inputValue: ', inputValue)
    // Khi giá trị có thay đỏi thì gọi lên func ở Props cha để xử lí
    onChangedValue(inputValue)
  }

  return (
    <TextField
      id='toggle-focus-input-controlled'
      fullWidth
      variant='outlined'
      size='small'
      value={inputValue}
      onChange={(event) => { setInputValue(event.target.value) }}
      onBlur={triggerBlur}
      {...props}
      // Magic here :D
      sx={{
        '& label': {},
        '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
          '& fieldset': { borderColor: 'primary.main' }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }}
    />
  )
}

export default ToggleFocusInput
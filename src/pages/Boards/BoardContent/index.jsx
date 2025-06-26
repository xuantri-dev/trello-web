import Box from "@mui/material/Box";

function BoardContent() {
  return (
    <Box
      sx={(theme) => {
        console.log(theme); // 👈 kiểm tra xem có theme.trello không
        return {
          height: `calc(100vh - ${theme.trello?.appBarHeight ?? "64px"} - ${
            theme.trello?.boardBarHeight ?? "52px"
          })`,
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
          width: "100%",
        };
      }}
    >
      Board Content
    </Box>
  );
}

export default BoardContent;

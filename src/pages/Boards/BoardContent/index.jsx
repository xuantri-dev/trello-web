import Box from "@mui/material/Box";

function BoardContent() {
  // return (
  //   <Box
  //     sx={{
  //       bgcolor: (theme) =>
  //         theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
  //       width: "100%",
  //       height: (theme) =>
  //         `calc(100vh - ${theme.trello.appBarHeight}-${theme.trello.appBarHeight})`,
  //       display: "flex",
  //       alignItems: "center",
  //     }}
  //   >
  //     Board Content
  //   </Box>
  // );

  return (
    <Box
      sx={(theme) => {
        return {
          height: `calc(100vh - ${theme.trello?.appBarHeight ?? "64px"} - ${
            theme.trello?.boardBarHeight ?? "52px"
          })`,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
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

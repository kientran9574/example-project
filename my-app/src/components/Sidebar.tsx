import React from "react";
import { Box, Button } from "@mui/material";

const Sidebar = () => {
  /**
   * Hàm xử lý khi bắt đầu kéo node
   */
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    // Thiết lập dữ liệu node khi bắt đầu kéo
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box sx={{ width: 250, padding: 2, backgroundColor: "#f0f0f0" }}>
      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
        onDragStart={(event) => onDragStart(event, "httpNode")}
        draggable
      >
        HTTP Node
      </Button>

      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
        onDragStart={(event) => onDragStart(event, "emailNode")}
        draggable
      >
        Email Node
      </Button>

      <Button
        variant="contained"
        onDragStart={(event) => onDragStart(event, "dbNode")}
        draggable
      >
        Database Node
      </Button>
    </Box>
  );
};

export default Sidebar;

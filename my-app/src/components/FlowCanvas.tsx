/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import {
  createNodeAPI,
  createEdgeAPI,
  getNodesAndEdgesAPI,
  sendEmailAPI,
  getEmailLogsAPI,
} from "../api";

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /**
   * Fetch dữ liệu từ backend khi component mount
   */
  useEffect(() => {
    const fetchData = async () => {
      const data = await getNodesAndEdgesAPI();
      setNodes(data?.nodes || []);
      setEdges(data?.edges || []);
    };
    fetchData();
  }, [setEdges, setNodes]);

  /**
   * Hàm xử lý khi kết nối edge
   */
  const onConnect = useCallback(
    async (params: Connection) => {
      const newEdge: Edge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source as string,
        target: params.target as string,
        type: "smoothstep",
      };

      setEdges((eds) => addEdge(newEdge, eds));

      // Lưu edge vào database
      await createEdgeAPI(newEdge);

      // Kích hoạt workflow
      handleWorkflow(newEdge);
    },
    [nodes, setEdges]
  );

  /**
   * Hàm xử lý workflow khi kết nối edge
   */
  const handleWorkflow = async (edge: Edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    if (!sourceNode || !targetNode) return;

    console.log(
      `Executing workflow from ${sourceNode.type} to ${targetNode.type}`
    );

    switch (sourceNode.type) {
      case "httpNode":
        handleHttpNode(sourceNode, targetNode);
        break;

      case "emailNode":
        handleEmailNode(sourceNode);
        break;

      case "dbNode":
        handleDatabaseNode(sourceNode);
        break;

      default:
        console.log("Unknown node type");
    }
  };

  /**
   * Xử lý HTTP Node - Gửi dữ liệu từ HTTP Node tới Email Node
   */
  const handleHttpNode = async (sourceNode: any, targetNode: any) => {
    const apiData = {
      emailRecipient: targetNode.data.emailRecipient,
      emailContent: `Data received: ${sourceNode.data.url}`,
    };

    console.log("Data from HTTP Node:", apiData);

    targetNode.data = { ...targetNode.data, ...apiData };
    setNodes((nds) =>
      nds.map((node) =>
        node.id === targetNode.id
          ? { ...node, data: { ...node.data, ...apiData } }
          : node
      )
    );
  };

  /**
   * Xử lý Email Node - Gửi email và lưu log
   */
  const handleEmailNode = async (node: any) => {
    const { id, data } = node;

    try {
      console.log("Sending email to:", data.emailRecipient);

      await sendEmailAPI(id, data.emailRecipient, data.emailContent);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    // Lấy log email và hiển thị trong console
    const logs = await getEmailLogsAPI();
    console.log("Email Logs:", logs);
  };

  /**
   * Xử lý Database Node - Lưu dữ liệu vào MongoDB
   */
  const handleDatabaseNode = (node: any) => {
    console.log("Processing data in Database Node:", node.data);
  };

  /**
   * Hàm xử lý khi thả node vào canvas
   */
  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData("application/reactflow");
    const position = {
      x: event.clientX - 250,
      y: event.clientY,
    };

    const newNode = {
      id: (nodes.length + 1).toString(),
      type: nodeType,
      position,
      data: createNodeData(nodeType),
    };

    setNodes((nds) => [...nds, newNode]);

    // Lưu node vào database
    await createNodeAPI(newNode);
  };

  /**
   * Hàm tạo dữ liệu cho từng loại node
   */
  const createNodeData = (nodeType: string) => {
    switch (nodeType) {
      case "httpNode":
        return {
          label: "HTTP Node",
          url: "https://api.example.com/data",
          method: "GET",
        };

      case "emailNode":
        return {
          label: "Email Node",
          emailRecipient: "kienbtsv@gmail.com",
          emailContent: "This is a test email",
        };

      case "dbNode":
        return {
          label: "Database Node",
          query: "SELECT * FROM users",
        };

      default:
        return { label: "Unknown Node" };
    }
  };

  /**
   * Hàm xử lý sự kiện khi kéo node qua canvas
   */
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box
        sx={{ flex: 1, backgroundColor: "#fafafa" }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default FlowCanvas;

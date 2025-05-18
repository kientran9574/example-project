/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// API: Tạo node mới
export const createNodeAPI = async (nodeData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/nodes`, nodeData);
    return response.data;
  } catch (error) {
    console.error("Error creating node:", error);
  }
};

// API: Tạo edge mới
export const createEdgeAPI = async (edgeData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/edges`, edgeData);
    return response.data;
  } catch (error) {
    console.error("Error creating edge:", error);
  }
};

// API: Lấy tất cả nodes và edges
export const getNodesAndEdgesAPI = async () => {
  try {
    const nodes = await axios.get(`${API_BASE_URL}/nodes`);
    const edges = await axios.get(`${API_BASE_URL}/edges`);
    return {
      nodes: nodes.data,
      edges: edges.data,
    };
  } catch (error) {
    console.error("Error fetching nodes and edges:", error);  
  }
};


// Gửi email
export const sendEmailAPI = async (
  nodeId: string,
  emailRecipient: string,
  emailContent: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-email`, {
      nodeId,
      emailRecipient,
      emailContent,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Lấy tất cả email log
export const getEmailLogsAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/email-logs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching email logs:", error);
  }
};

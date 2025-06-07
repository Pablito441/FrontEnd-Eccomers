import axios from "axios";
import type { Type } from "../types/IType";

const API_URL = "http://localhost:9000/api/v1/types";

export async function fetchTypes(): Promise<Type[]> {
  try {
    const response = await axios.get<Type[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Fetch types failed:", error);
    return [];
  }
}

export async function fetchTypeById(id: number): Promise<Type | null> {
  try {
    const response = await axios.get<Type>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch type by id failed:", error);
    return null;
  }
}

export async function createType(
  type: Omit<Type, "id" | "createdAt" | "updatedAt" | "deletedAt" | "isActive">
): Promise<Type | null> {
  try {
    const response = await axios.post<Type>(API_URL, type);
    return response.data;
  } catch (error) {
    console.error("Create type failed:", error);
    return null;
  }
}

export async function deleteType(id: number): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Delete type failed:", error);
    return false;
  }
}

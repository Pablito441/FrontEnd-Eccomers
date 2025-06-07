import axios from "axios";
import type { Category } from "../types/ICategory";

const API_URL = "http://localhost:9000/api/v1/categories";

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await axios.get<Category[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Fetch categories failed:", error);
    return [];
  }
}

export async function fetchCategoryById(id: number): Promise<Category | null> {
  try {
    const response = await axios.get<Category>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch category by id failed:", error);
    return null;
  }
}

export async function createCategory(category: {
  name: string;
  typeId: number;
}): Promise<Category | null> {
  try {
    const response = await axios.post<Category>(API_URL, category);
    return response.data;
  } catch (error) {
    console.error("Create category failed:", error);
    return null;
  }
}

export async function deleteCategory(id: number): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Delete category failed:", error);
    return false;
  }
}

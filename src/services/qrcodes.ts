import { API_URL } from "@/config";
import type { InsertQRCode, InsertQRCodeBulk, QRCode } from "@/types/qrcode";

const BASE_URL = `${API_URL}/qrcodes`;

export const getAllQRCodes = async (): Promise<QRCode[]> => {
  const response = await fetch(BASE_URL, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch qrcode");
  return response.json();
};

export const getQRCode = async (id: number): Promise<QRCode> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch qrcode");
  return response.json();
};

export const createQRCode = async (data: InsertQRCode): Promise<QRCode> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create qrcode");
  return response.json();
};

export const createQRCodes = async (data: InsertQRCodeBulk): Promise<QRCode[]> => {
  const response = await fetch(`${BASE_URL}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create qrcodes");
  return response.json();
};

export const updateQRCode = async ({ id, data }: { id: number; data: InsertQRCode }): Promise<QRCode> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update qrcode");
  return response.json();
};

export const deleteQRCode = async (id: number): Promise<QRCode> => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE", 
    headers: { "Content-Type": "application/json" },
    credentials: "include" });
  if (!response.ok) throw new Error("Failed to delete qrcode");
  return response.json();
};

export const activateQRCode = async (id: number, resource: string): Promise<QRCode> => {
  const response = await fetch(`${BASE_URL}/${id}/link`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({resource}),
  });
  if (!response.ok) throw new Error("Failed to activate qrcode");
  return response.json();
};

export const scanQRCode = async (id: number): Promise<QRCode> => {
  const response = await fetch(`${BASE_URL}/${id}/scan`);
  if (!response.ok) throw new Error("Failed to scan qrcode");
  return response.json();
};

export const qrcodeService = {
  getAll: getAllQRCodes,
  get: getQRCode,
  create: createQRCode,
  createMultiple: createQRCodes,
  update: updateQRCode,
  delete: deleteQRCode,
  activate: activateQRCode,
  scan: scanQRCode,
};

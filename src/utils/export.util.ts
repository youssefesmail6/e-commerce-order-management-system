import Container from "typedi";
import { Logger } from "../services/logger.service";
import BadRequestException from "../exceptions/bad-request.exception";

const logger = Container.get(Logger);

interface DataObject {
  [key: string]: any;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const convertToCSV = (data: DataObject[]) => {
  try {
    if (data.length === 0) {
      throw new BadRequestException("You don't have any orders yet to export.");
    }

    // Get headers from the keys of the first object
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers row
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        // Escape quotes by doubling them, then wrap in double quotes
        if (typeof value === "string") {
          return `${value.replace(/"/g, '""')}`;
        }
        if (Array.isArray(value)) {
          // Convert orderItems to a readable string format
          if (header === "orderItems") {
            return `"${value.map((item) => `${item.product} (x${item.quantity}) - $${item.price}`).join(" | ")}"`;
          }
          return `"${value.join(" | ")}"`;
        }

        if (value instanceof Date) {
          return formatDate(value);
        }

        return value;
      });
      csvRows.push(values.join(","));
    }

    // Join all rows with new line
    const csvContent = csvRows.join("\n");

    return csvContent;
  } catch (error: any) {
    logger.error(`convertToCSV: ${error.message}`);
    throw error;
  }
};

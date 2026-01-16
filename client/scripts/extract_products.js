const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = String.raw`c:\Users\shyam\OneDrive\Desktop\SS\zip\savaj-seed\Savaj Seed Product.xlsx`;

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  console.log(JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Error reading file:', error);
  process.exit(1);
}

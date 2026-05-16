package com.samlego.backend.security;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import com.samlego.backend.model.Product;
import com.samlego.backend.model.Category;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelHelper {
    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static boolean hasExcelFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: 
                if (DateUtil.isCellDateFormatted(cell)) return cell.getDateCellValue().toString();
                return String.valueOf((long)cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA: return cell.getCellFormula();
            default: return "";
        }
    }

    public static List<Product> excelToProducts(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            List<Product> products = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Product product = new Product();
                
                // Assuming columns: Name, ProductCode, Description, Price, Stock, ImageURL, CategoryID
                product.setName(getCellValueAsString(currentRow.getCell(0)));
                product.setProductCode(getCellValueAsString(currentRow.getCell(1)));
                product.setDescription(getCellValueAsString(currentRow.getCell(2)));
                product.setPrice(BigDecimal.valueOf(currentRow.getCell(3).getNumericCellValue()));
                product.setStockQuantity((int) currentRow.getCell(4).getNumericCellValue());
                product.setImageUrl(getCellValueAsString(currentRow.getCell(5)));
                
                Category category = new Category();
                category.setId((long) currentRow.getCell(6).getNumericCellValue());
                product.setCategory(category);

                products.add(product);
            }

            workbook.close();
            return products;
        } catch (Exception e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }
}

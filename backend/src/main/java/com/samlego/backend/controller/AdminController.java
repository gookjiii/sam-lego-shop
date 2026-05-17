package com.samlego.backend.controller;

import com.samlego.backend.dto.AdminStatsResponse;
import com.samlego.backend.model.Category;
import com.samlego.backend.model.Order;
import com.samlego.backend.model.Product;
import com.samlego.backend.repository.CategoryRepository;
import com.samlego.backend.repository.OrderItemRepository;
import com.samlego.backend.repository.OrderRepository;
import com.samlego.backend.repository.ProductRepository;
import com.samlego.backend.security.ExcelHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @PostMapping("/products/import")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (ExcelHelper.hasExcelFormat(file)) {
            try {
                List<Product> products = ExcelHelper.excelToProducts(file.getInputStream());
                productRepository.saveAll(products);
                return ResponseEntity.ok("Uploaded the file successfully: " + file.getOriginalFilename());
            } catch (Exception e) {
                String message = "Could not upload the file: " + file.getOriginalFilename() + "! Error: " + e.getMessage();
                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload an excel file!");
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        productRepository.save(product);
        return ResponseEntity.ok("Product added successfully!");
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setName(productDetails.getName());
        product.setProductCode(productDetails.getProductCode());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setPreAssembledPrice(productDetails.getPreAssembledPrice());
        product.setPreAssembledWithFlowerPrice(productDetails.getPreAssembledWithFlowerPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        
        productRepository.save(product);
        return ResponseEntity.ok("Product updated successfully!");
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted successfully!");
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        categoryRepository.save(category);
        return ResponseEntity.ok("Category added successfully!");
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        Category category = categoryRepository.findById(id).orElseThrow();
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setImageUrl(categoryDetails.getImageUrl());
        categoryRepository.save(category);
        return ResponseEntity.ok("Category updated successfully!");
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        // Warning: this will fail if products are linked to this category unless handled
        categoryRepository.deleteById(id);
        return ResponseEntity.ok("Category deleted successfully!");
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status) {
        System.out.println("Updating order status for ID: " + id + " to: " + status);
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(status);
        orderRepository.save(order);
        return ResponseEntity.ok("Order status updated to " + status);
    }

    @DeleteMapping("/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
        return ResponseEntity.ok("Order deleted successfully!");
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        AdminStatsResponse stats = new AdminStatsResponse();
        
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != Order.OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.setTotalRevenue(totalRevenue);
        stats.setTotalOrders(allOrders.size());
        stats.setTotalProducts(productRepository.count());

        List<Map<String, Object>> daily = new ArrayList<>();
        for (Object[] row : orderRepository.findDailyRevenue()) {
            Map<String, Object> m = new HashMap<>();
            m.put("name", row[0]);
            m.put("revenue", row[1]);
            daily.add(m);
        }
        stats.setMonthlyRevenue(daily); // Keeping the field name for frontend compatibility, but with daily data

        List<Map<String, Object>> top = new ArrayList<>();
        for (Object[] row : orderItemRepository.findTopSellingProducts()) {
            Map<String, Object> t = new HashMap<>();
            t.put("name", row[0]);
            t.put("sales", row[1]);
            top.add(t);
        }
        stats.setTopSellingProducts(top);

        return ResponseEntity.ok(stats);
    }
}

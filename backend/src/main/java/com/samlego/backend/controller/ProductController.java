package com.samlego.backend.controller;

import com.samlego.backend.model.Product;
import com.samlego.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) Long categoryId,
                                        @RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            if (categoryId != null) {
                return productRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, search);
            }
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}

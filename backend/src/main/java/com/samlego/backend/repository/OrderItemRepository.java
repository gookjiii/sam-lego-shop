package com.samlego.backend.repository;

import com.samlego.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query(value = """
            SELECT p.name, SUM(oi.quantity) as sales
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.id, p.name
            ORDER BY sales DESC
            LIMIT 5
            """, nativeQuery = true)
    List<Object[]> findTopSellingProducts();
}

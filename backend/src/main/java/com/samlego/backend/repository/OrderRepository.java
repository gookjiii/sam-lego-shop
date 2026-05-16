package com.samlego.backend.repository;

import com.samlego.backend.model.Order;
import com.samlego.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    @Query(value = """
            SELECT TO_CHAR(created_at, 'DD/MM') as name,
                   SUM(total_amount) as revenue
            FROM orders
            WHERE status != 'CANCELLED'
              AND created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE_TRUNC('day', created_at), TO_CHAR(created_at, 'DD/MM')
            ORDER BY DATE_TRUNC('day', created_at)
            """, nativeQuery = true)
    List<Object[]> findDailyRevenue();
}

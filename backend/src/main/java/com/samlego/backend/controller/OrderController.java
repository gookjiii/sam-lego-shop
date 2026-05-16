package com.samlego.backend.controller;

import com.samlego.backend.model.Order;
import com.samlego.backend.model.User;
import com.samlego.backend.repository.OrderRepository;
import com.samlego.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<Order> getUserOrders(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return orderRepository.findByUser(user);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order, Authentication authentication) {
        if (authentication != null && !"anonymousUser".equals(authentication.getName())) {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            order.setUser(user);
        }
        order.setStatus(Order.OrderStatus.PENDING);
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        return orderRepository.save(order);
    }
}

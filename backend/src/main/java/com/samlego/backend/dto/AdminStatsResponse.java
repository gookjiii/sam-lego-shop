package com.samlego.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminStatsResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalProducts;
    private List<Map<String, Object>> monthlyRevenue;
    private List<Map<String, Object>> topSellingProducts;

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public List<Map<String, Object>> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public List<Map<String, Object>> getTopSellingProducts() { return topSellingProducts; }
    public void setTopSellingProducts(List<Map<String, Object>> topSellingProducts) { this.topSellingProducts = topSellingProducts; }
}

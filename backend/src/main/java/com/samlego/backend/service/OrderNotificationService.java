package com.samlego.backend.service;

import com.samlego.backend.model.Order;
import com.samlego.backend.model.OrderItem;
import com.samlego.backend.model.Product;
import com.samlego.backend.model.User;
import com.samlego.backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class OrderNotificationService {
    private static final Logger logger = LoggerFactory.getLogger(OrderNotificationService.class);
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;
    private final String adminEmail;
    private final String mailFrom;
    private final String resendApiKey;
    private final String telegramBotToken;
    private final String telegramChatId;

    public OrderNotificationService(
            ProductRepository productRepository,
            @Value("${samlego.mail.admin:}") String adminEmail,
            @Value("${samlego.mail.from:no-reply@samlego.com}") String mailFrom,
            @Value("${samlego.resend.apiKey:}") String resendApiKey,
            @Value("${telegram.bot.token:}") String telegramBotToken,
            @Value("${telegram.chat.id:}") String telegramChatId) {
        this.productRepository = productRepository;
        this.restTemplate = new RestTemplate();
        this.adminEmail = adminEmail;
        this.mailFrom = mailFrom;
        this.resendApiKey = resendApiKey;
        this.telegramBotToken = telegramBotToken;
        this.telegramChatId = telegramChatId;
        logger.info("OrderNotificationService initialized with adminEmail: {}, mailFrom: {}", adminEmail, mailFrom);
    }

    public void sendNewOrderEmail(Order order) {
        logger.info("Starting to send new order email for order #{}", order.getId());

        if (!StringUtils.hasText(adminEmail)) {
            logger.warn("ADMIN_EMAIL is not configured. Skipping new order email for order #{}", order.getId());
            return;
        }

        if (!StringUtils.hasText(resendApiKey)) {
            logger.warn("RESEND_API_KEY is not configured. Skipping new order email for order #{}", order.getId());
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("from", mailFrom);
            body.put("to", adminEmail);
            body.put("subject", "SamLego - Don hang moi #" + order.getId());
            body.put("text", buildEmailBody(order));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            logger.info("Sending request to Resend API for order #{}", order.getId());
            restTemplate.postForEntity("https://api.resend.com/emails", request, String.class);
            
            logger.info("Successfully sent new order email via Resend for order #{} to {}", order.getId(), adminEmail);
        } catch (Exception e) {
            logger.error("Failed to send new order email via Resend for order #{}: {}", order.getId(), e.getMessage());
        }
    }

    public void sendTelegramNotification(Order order) {
        if (!StringUtils.hasText(telegramBotToken) || !StringUtils.hasText(telegramChatId)) {
            logger.warn("Telegram not configured. Skipping notification for order #{}", order.getId());
            return;
        }

        try {
            String text = buildTelegramMessage(order);
            String url = "https://api.telegram.org/bot" + telegramBotToken + "/sendMessage";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("chat_id", telegramChatId);
            body.put("text", text);
            body.put("parse_mode", "HTML");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, request, String.class);

            logger.info("Telegram notification sent for order #{}", order.getId());
        } catch (Exception e) {
            logger.error("Failed to send Telegram notification for order #{}: {}", order.getId(), e.getMessage());
        }
    }

    private String buildTelegramMessage(Order order) {
        StringBuilder msg = new StringBuilder();
        msg.append("<b>Don hang moi #").append(order.getId()).append("</b>\n\n");
        msg.append("Thoi gian: ").append(order.getCreatedAt() != null ? order.getCreatedAt().format(DATE_TIME_FORMATTER) : "N/A").append("\n");
        msg.append("Tong tien: <b>").append(formatVnd(order.getTotalAmount())).append("</b>\n");
        msg.append("Thanh toan: ").append(valueOrDefault(order.getPaymentMethod())).append("\n");
        msg.append("Dia chi: ").append(valueOrDefault(order.getShippingAddress())).append("\n\n");

        User user = order.getUser();
        msg.append("<b>Khach hang:</b>\n");
        if (user != null) {
            msg.append("Ten: ").append(valueOrDefault(firstNonBlank(user.getFullName(), user.getUsername()))).append("\n");
            msg.append("Email: ").append(valueOrDefault(user.getEmail())).append("\n");
            msg.append("SDT: ").append(valueOrDefault(user.getPhone())).append("\n");
        } else {
            msg.append("Khach chua dang nhap\n");
        }

        msg.append("\n<b>San pham:</b>\n");
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                String productName = resolveProductName(item);
                msg.append("- ").append(productName)
                        .append(" x").append(item.getQuantity())
                        .append(" - ").append(formatVnd(item.getPrice()));
                if (StringUtils.hasText(item.getServiceOption())) {
                    msg.append(" (").append(item.getServiceOption()).append(")");
                }
                msg.append("\n");
            }
        }

        return msg.toString();
    }

    private String buildEmailBody(Order order) {
        StringBuilder body = new StringBuilder();
        body.append("SamLego co don hang moi #").append(order.getId()).append("\n\n");
        body.append("Thoi gian: ").append(order.getCreatedAt() != null ? order.getCreatedAt().format(DATE_TIME_FORMATTER) : "N/A").append("\n");
        body.append("Tong tien: ").append(formatVnd(order.getTotalAmount())).append("\n");
        body.append("Thanh toan: ").append(valueOrDefault(order.getPaymentMethod())).append("\n");
        body.append("Dia chi giao hang: ").append(valueOrDefault(order.getShippingAddress())).append("\n\n");

        User user = order.getUser();
        body.append("Khach hang:\n");
        if (user != null) {
            body.append("- Ten: ").append(valueOrDefault(firstNonBlank(user.getFullName(), user.getUsername()))).append("\n");
            body.append("- Email: ").append(valueOrDefault(user.getEmail())).append("\n");
            body.append("- Dien thoai: ").append(valueOrDefault(user.getPhone())).append("\n");
        } else {
            body.append("- Khach chua dang nhap\n");
        }

        body.append("\nSan pham:\n");
        if (order.getItems() == null || order.getItems().isEmpty()) {
            body.append("- Khong co san pham\n");
        } else {
            for (OrderItem item : order.getItems()) {
                String productName = resolveProductName(item);
                body.append("- ")
                        .append(productName)
                        .append(" x")
                        .append(item.getQuantity())
                        .append(" - ")
                        .append(formatVnd(item.getPrice()));
                if (StringUtils.hasText(item.getServiceOption())) {
                    body.append(" (").append(item.getServiceOption()).append(")");
                }
                body.append("\n");
            }
        }

        body.append("\nVui long kiem tra trang quan tri de xu ly don hang.");
        return body.toString();
    }

    private String resolveProductName(OrderItem item) {
        Product product = item.getProduct();
        if (product == null) {
            return "San pham";
        }
        if (StringUtils.hasText(product.getName())) {
            return product.getName();
        }
        if (product.getId() == null) {
            return "San pham";
        }
        return productRepository.findById(product.getId())
                .map(Product::getName)
                .filter(StringUtils::hasText)
                .orElse("San pham #" + product.getId());
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(first) ? first : second;
    }

    private String valueOrDefault(String value) {
        return StringUtils.hasText(value) ? value : "N/A";
    }

    private String formatVnd(BigDecimal value) {
        if (value == null) {
            return "0 VND";
        }
        return NumberFormat.getNumberInstance(Locale.forLanguageTag("vi-VN")).format(value) + " VND";
    }
}

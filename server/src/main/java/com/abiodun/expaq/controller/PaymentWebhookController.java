package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.Payment.PaymentStatus;
import com.abiodun.expaq.service.IPaymentService;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final IPaymentService paymentService;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Value("${paystack.webhook.secret}")
    private String paystackWebhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestHeader("Stripe-Signature") String signature,
            @RequestBody String payload) {
        try {
//            Event event = Event.constructEvent(payload, signature, stripeWebhookSecret);
            Event event = Webhook.constructEvent(payload, signature, stripeWebhookSecret);
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject = null;
            if (dataObjectDeserializer.getObject().isPresent()) {
                stripeObject = dataObjectDeserializer.getObject().get();
            }

            switch (event.getType()) {
                case "payment_intent.succeeded" -> {
                    PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
                    String paymentId = paymentIntent.getMetadata().get("paymentId");
                    paymentService.updatePaymentStatus(
                            java.util.UUID.fromString(paymentId),
                            PaymentStatus.COMPLETED,
                            paymentIntent.getId()
                    );
                }
                case "payment_intent.payment_failed" -> {
                    PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
                    String paymentId = paymentIntent.getMetadata().get("paymentId");
                    paymentService.updatePaymentStatus(
                            java.util.UUID.fromString(paymentId),
                            PaymentStatus.FAILED,
                            paymentIntent.getId()
                    );
                }
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing Stripe webhook", e);
            return ResponseEntity.badRequest().body("Webhook Error: " + e.getMessage());
        }
    }

    @PostMapping("/paystack")
    public ResponseEntity<String> handlePaystackWebhook(
            @RequestHeader("x-paystack-signature") String signature,
            @RequestBody Map<String, Object> payload) {
        try {
            // Verify Paystack signature
            if (!verifyPaystackSignature(signature, payload)) {
                return ResponseEntity.badRequest().body("Invalid signature");
            }

            String event = (String) payload.get("event");
            Map<String, Object> data = (Map<String, Object>) payload.get("data");

            switch (event) {
                case "charge.success" -> {
                    String reference = (String) data.get("reference");
                    String paymentId = (String) ((Map<String, Object>) data.get("metadata")).get("paymentId");
                    paymentService.updatePaymentStatus(
                            java.util.UUID.fromString(paymentId),
                            PaymentStatus.COMPLETED,
                            reference
                    );
                }
                case "charge.failed" -> {
                    String reference = (String) data.get("reference");
                    String paymentId = (String) ((Map<String, Object>) data.get("metadata")).get("paymentId");
                    paymentService.updatePaymentStatus(
                            java.util.UUID.fromString(paymentId),
                            PaymentStatus.FAILED,
                            reference
                    );
                }
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing Paystack webhook", e);
            return ResponseEntity.badRequest().body("Webhook Error: " + e.getMessage());
        }
    }

    private boolean verifyPaystackSignature(String signature, Map<String, Object> payload) {
        // Implement Paystack signature verification
        // This is a simplified version - you should implement proper signature verification
        return signature != null && !signature.isEmpty();
    }
} 
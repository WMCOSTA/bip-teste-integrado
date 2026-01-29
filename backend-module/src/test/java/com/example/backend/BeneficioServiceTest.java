package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class BeneficioServiceTest {

    @Autowired
    private BeneficioService service;

    @Test
    public void testTransferSuccess() {
        service.transfer(1L, 2L, new BigDecimal("100.00"));
        
        Beneficio from = service.findById(1L).get();
        Beneficio to = service.findById(2L).get();
        
        assertEquals(new BigDecimal("900.00"), from.getValor());
        assertEquals(new BigDecimal("600.00"), to.getValor());
    }

    @Test
    public void testTransferInsufficientFunds() {
        assertThrows(RuntimeException.class, () -> {
            service.transfer(1L, 2L, new BigDecimal("2000.00"));
        });
    }

    @Test
    public void testTransferNegativeAmount() {
        assertThrows(IllegalArgumentException.class, () -> {
            service.transfer(1L, 2L, new BigDecimal("-50.00"));
        });
    }
}

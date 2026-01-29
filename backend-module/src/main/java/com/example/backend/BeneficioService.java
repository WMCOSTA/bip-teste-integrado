package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BeneficioService {

    @Autowired
    private BeneficioRepository repository;

    public List<Beneficio> findAll() {
        return repository.findAll();
    }

    public Optional<Beneficio> findById(Long id) {
        return repository.findById(id);
    }

    public Beneficio save(Beneficio beneficio) {
        return repository.save(beneficio);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da transferência deve ser positivo");
        }

        Beneficio from = repository.findById(fromId)
                .orElseThrow(() -> new RuntimeException("Benefício de origem não encontrado"));
        Beneficio to = repository.findById(toId)
                .orElseThrow(() -> new RuntimeException("Benefício de destino não encontrado"));

        if (from.getValor().compareTo(amount) < 0) {
            throw new RuntimeException("Saldo insuficiente para a transferência");
        }

        // O Spring Data JPA com @Version na entidade já trata o Lost Update via Optimistic Locking
        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        repository.save(from);
        repository.save(to);
    }
}

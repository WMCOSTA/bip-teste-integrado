package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "*")
public class BeneficioController {

    @Autowired
    private BeneficioService service;

    @GetMapping
    public List<Beneficio> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Beneficio> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Beneficio create(@RequestBody Beneficio beneficio) {
        return service.save(beneficio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Beneficio> update(@PathVariable Long id, @RequestBody Beneficio beneficio) {
        return service.findById(id)
                .map(existing -> {
                    beneficio.setId(id);
                    return ResponseEntity.ok(service.save(beneficio));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.findById(id)
                .map(existing -> {
                    service.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestParam Long fromId, @RequestParam Long toId, @RequestParam BigDecimal amount) {
        try {
            service.transfer(fromId, toId, amount);
            return ResponseEntity.ok("Transferência realizada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

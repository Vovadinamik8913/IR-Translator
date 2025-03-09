package ru.ir.translator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.lang.Compiler;
import ru.ir.translator.model.lang.Language;

import java.util.List;
import java.util.Optional;

public interface CompilerRepository extends JpaRepository<Compiler, Long> {
    Optional<Compiler> findByLanguage(Language language);
    Optional<Compiler> findByName(String name);
    Optional<List<Compiler>> findAllByLanguage(Language language);
}

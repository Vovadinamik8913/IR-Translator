package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.LLLanguage;
import ru.ir.translator.model.classes.lang.Language;

import java.util.Optional;

public interface CompilerRepository extends JpaRepository<Compiler, Long> {
    Optional<Compiler> findByLanguage(Language language);
    Optional<Compiler> findByName(String name);
}

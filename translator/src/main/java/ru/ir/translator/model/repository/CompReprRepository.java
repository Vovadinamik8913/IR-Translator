package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.CompilerRepresentation;
import ru.ir.translator.model.classes.lang.LLLanguage;

import java.util.Optional;

public interface CompReprRepository extends JpaRepository<CompilerRepresentation, Long> {
    Optional<CompilerRepresentation> findByPair(Compiler compiler, LLLanguage language);
}

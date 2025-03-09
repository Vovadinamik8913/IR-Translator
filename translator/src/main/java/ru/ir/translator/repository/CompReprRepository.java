package ru.ir.translator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.lang.Compiler;
import ru.ir.translator.model.lang.CompilerRepresentation;
import ru.ir.translator.model.lang.LLLanguage;

import java.util.List;
import java.util.Optional;

public interface CompReprRepository extends JpaRepository<CompilerRepresentation, Long> {
    Optional<CompilerRepresentation> findByCompilerAndLllanguage(Compiler compiler, LLLanguage language);
    Optional<List<CompilerRepresentation>> findAllByCompiler(Compiler compiler);
}

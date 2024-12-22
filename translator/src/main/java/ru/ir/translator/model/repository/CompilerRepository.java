package ru.ir.translator.model.repository;

import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.LLLanguage;
import ru.ir.translator.model.classes.lang.Language;

import java.util.Optional;

public interface CompilerRepository {
    Optional<Compiler> findByLanguage(Language language);
}

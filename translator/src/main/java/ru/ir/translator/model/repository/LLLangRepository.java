package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.lang.LLLang;
import ru.ir.translator.model.classes.lang.LLLanguage;

import java.util.Optional;

public interface LLLangRepository extends JpaRepository<LLLanguage, Long> {
    Optional<LLLanguage> findByName(String language);

}

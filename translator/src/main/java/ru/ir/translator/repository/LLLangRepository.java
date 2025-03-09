package ru.ir.translator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.lang.LLLanguage;

import java.util.Optional;

public interface LLLangRepository extends JpaRepository<LLLanguage, Long> {
    Optional<LLLanguage> findByName(String language);

}

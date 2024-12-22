package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.lang.LLLanguage;

public interface LLLangRepository extends JpaRepository<LLLanguage, Long> {
}

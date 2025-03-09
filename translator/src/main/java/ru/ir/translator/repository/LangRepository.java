package ru.ir.translator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.lang.Language;

import java.util.Optional;

public interface LangRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByName(String language);
}

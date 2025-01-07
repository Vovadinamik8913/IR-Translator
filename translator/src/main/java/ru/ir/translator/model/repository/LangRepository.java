package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.lang.Lang;
import ru.ir.translator.model.classes.lang.Language;

import java.util.Optional;

public interface LangRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByName(String language);
}

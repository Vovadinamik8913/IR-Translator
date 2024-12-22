package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.lang.Language;

public interface LangRepository extends JpaRepository<Language, Long> {
}

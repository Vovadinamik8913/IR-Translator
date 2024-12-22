package ru.ir.translator.model.classes.lang;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class LLLanguage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Transient
    private LLLang type;

    @Basic
    private int langCode;

    @PostLoad
    private void fillTransient() {
        if (langCode > 0) {
            this.type = LLLang.of(langCode);
        }
    }

    @PrePersist
    private void fillPersistent() {
        if (type != null) {
            this.langCode = type.getCode();
        }
    }
}

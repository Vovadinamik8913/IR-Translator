package ru.ir.translator.model.classes.lang;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Transient
    private Lang lang;

    @Basic
    private int langCode;

    @PostLoad
    private void fillTransient() {
        if (langCode > 0) {
            this.lang = Lang.of(langCode);
        }
    }

    @PrePersist
    private void fillPersistent() {
        if (lang != null) {
            this.langCode = lang.getCode();
        }
    }
}

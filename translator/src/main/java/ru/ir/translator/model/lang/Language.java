package ru.ir.translator.model.lang;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Entity
@Getter
@EqualsAndHashCode
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Transient
    private Lang lang;

    @Basic
    private String name;

    @PostLoad
    private void fillTransient() {
        if (name != null && !name.isEmpty()) {
            this.lang = Lang.of(name);
        }
    }

    @PrePersist
    private void fillPersistent() {
        if (lang != null) {
            this.name = lang.getName();
        }
    }
}

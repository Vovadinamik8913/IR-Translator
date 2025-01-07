package ru.ir.translator.model.classes.lang;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "compiler_representation")
@Getter
public class CompilerRepresentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "language_id")
    private LLLanguage lllanguage;

    @ManyToOne
    @JoinColumn(name = "compiler_id")
    private Compiler compiler;

    @Transient
    private String[] flags;

    @Basic
    private String specialFlags;

    @PostLoad
    private void fillTransient() {
        if (specialFlags != null) {
            this.flags = specialFlags.split(" ");
        }
    }

    @PrePersist
    private void fillPersistent() {
        if (flags != null) {
            this.specialFlags = String.join(" ", flags);
        }
    }
}


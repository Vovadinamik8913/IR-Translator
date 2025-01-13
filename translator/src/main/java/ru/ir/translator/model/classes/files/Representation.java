package ru.ir.translator.model.classes.files;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.LLLanguage;

import java.util.Arrays;
import java.util.List;

@Entity
@Getter
@Setter
public class Representation extends File {
    @ManyToOne  @JoinColumn(name = "language_id")
    private LLLanguage language;

    @ManyToOne @JoinColumn(name = "compiler_id")
    private Compiler compiler;

    @Transient
    private List<String> flags;

    @Basic
    private String specialFlags;

    public Representation() {}

    @PostLoad
    private void fillTransient() {
        if (specialFlags != null) {
            this.flags = Arrays.stream(specialFlags.split(" ")).toList();
        }
    }

    @PrePersist
    private void fillPersistent() {
        if (flags != null) {
            this.specialFlags = String.join(" ", flags);
        }
    }
}

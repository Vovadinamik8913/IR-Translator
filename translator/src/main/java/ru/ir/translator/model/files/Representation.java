package ru.ir.translator.model.files;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.ir.translator.model.Project;
import ru.ir.translator.model.lang.Compiler;
import ru.ir.translator.model.lang.LLLanguage;

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

    @OneToOne(cascade = CascadeType.ALL) @JoinColumn(name = "code_id")
    private Code code;

    @Transient
    private List<String> flags;

    @Basic
    private String specialFlags;

    public Representation() {}
    public Representation(String name, String path, Project project,
                          LLLanguage language, Compiler compiler, Code code, List<String> flags) {
        super(name, path, project);
        this.language = language;
        this.compiler = compiler;
        this.code = code;
        this.flags = flags;
    }

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

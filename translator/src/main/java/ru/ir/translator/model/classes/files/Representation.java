package ru.ir.translator.model.classes.files;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.LLLanguage;

@Entity
@Getter
@Setter
public class Representation extends File {
    @ManyToOne  @JoinColumn(name = "language_id")
    private LLLanguage language;

    @ManyToOne @JoinColumn(name = "compiler_id")
    private Compiler compiler;

    public Representation() {}
    public Representation(String name, String path, Compiler compiler, Project project, LLLanguage language) {
        super(name, path, project);
        this.language = language;
        this.compiler = compiler;
    }
}

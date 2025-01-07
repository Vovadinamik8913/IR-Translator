package ru.ir.translator.model.classes.files;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.Language;

@Entity
@Getter
public class Code extends File {
    @ManyToOne
    @JoinColumn(name = "language_id")
    private Language language;

    public Code() {}
    public Code(String name, String path, Project project, Language language) {
        super(name, path, project);
        this.language = language;
    }
}

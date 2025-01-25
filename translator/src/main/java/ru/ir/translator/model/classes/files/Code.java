package ru.ir.translator.model.classes.files;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.CompilerRepresentation;
import ru.ir.translator.model.classes.lang.Language;

import java.util.List;

@Entity
@Getter
public class Code extends File {
    @ManyToOne @JoinColumn(name = "language_id")
    @Setter
    private Language language;

    @OneToOne(mappedBy = "code", cascade = CascadeType.ALL)
    private Representation representation;

    public Code() {}
    public Code(String name, String path, Project project, Language language) {
        super(name, path, project);
        this.language = language;
    }
}

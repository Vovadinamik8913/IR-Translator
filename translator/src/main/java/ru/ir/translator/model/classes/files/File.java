package ru.ir.translator.model.classes.files;

import jakarta.persistence.*;
import lombok.Getter;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.Project;

@MappedSuperclass
@Getter
public abstract class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String path;
    @ManyToOne @JoinColumn(name = "compiler_id")
    private Compiler compiler;
    @ManyToOne @JoinColumn(name = "project_id")
    private Project project;
}

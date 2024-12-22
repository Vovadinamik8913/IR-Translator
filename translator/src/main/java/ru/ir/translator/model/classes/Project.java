package ru.ir.translator.model.classes;

import jakarta.persistence.*;
import lombok.Getter;
import ru.ir.translator.model.classes.files.Code;
import ru.ir.translator.model.classes.files.Representation;

import java.util.List;

@Entity
@Getter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String name;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "project")
    private List<Code> code;
    @OneToMany(mappedBy = "project")
    private List<Representation> representation;
}

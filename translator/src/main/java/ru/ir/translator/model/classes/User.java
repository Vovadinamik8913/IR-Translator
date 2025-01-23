package ru.ir.translator.model.classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true, nullable = false)
    private final UUID uuid;
    @Column(unique = true, nullable = false)
    @Setter
    private String login;
    @Column(nullable = false)
    @Setter
    private String password;
    @Column(nullable = false)
    private String email;
    @OneToMany(mappedBy = "user")
    private List<Project> projects;

    public User() {
        uuid = UUID.randomUUID();
    }

    public User(String login, String password, String email) throws RuntimeException {
        this();
        this.login = login;
        this.password = password;
        this.email = email;
    }


}

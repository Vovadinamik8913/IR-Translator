package ru.ir.translator.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ir.translator.LocalConfig;
import ru.ir.translator.model.classes.User;
import ru.ir.translator.view.service.UserService;

import java.io.File;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Operation(summary = "Регистрация пользователя")
    @PostMapping(value = "/registration")
    public ResponseEntity<UUID> registration(
            @Parameter(description = "Login", required = true) @RequestParam("login") String login,
            @Parameter(description = "Password", required = true) @RequestParam("password") String password,
            @Parameter(description = "Email", required = true) @RequestParam("email") String email
    ) {
        try {
            User user = new User(login, password, email);
            userService.create(user);
            String path = LocalConfig.getInstance().getWorkPath() + File.separator + user.getUuid();
            File userDir = new File(path);
            if (!userDir.exists()) {
                userDir.mkdirs();
            }
            return ResponseEntity.ok(user.getUuid());
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.ofNullable(null);
    }

    @Operation(summary = "Sign in")
    @PostMapping(value = "/login")
    public ResponseEntity<UUID> login(
            @Parameter(description = "Login", required = true) @RequestParam("login") String login,
            @Parameter(description = "Password", required = true) @RequestParam("password") String password
    ) {
        try {
            User user = userService.get(login, password);
            if (user != null) {
                return ResponseEntity.ok(user.getUuid());
            }
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.ofNullable(null);
    }
}

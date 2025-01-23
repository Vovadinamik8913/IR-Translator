package ru.ir.translator.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ir.translator.LocalConfig;
import ru.ir.translator.model.classes.User;
import ru.ir.translator.request.LogResponse;
import ru.ir.translator.security.JwtService;
import ru.ir.translator.view.service.UserService;

import java.io.File;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Operation(summary = "Регистрация пользователя")
    @PostMapping(value = "/registration")
    public ResponseEntity<LogResponse> registration(
            @Parameter(description = "Login", required = true) @RequestParam("login") String login,
            @Parameter(description = "Password", required = true) @RequestParam("password") String password,
            @Parameter(description = "Email", required = true) @RequestParam("email") String email
    ) {
        try {
            if (userService.get(login) != null) {
                return ResponseEntity.badRequest().build();
            }
            User user = new User(login, password, email);
            userService.create(user);
            String path = LocalConfig.getInstance().getWorkPath() + File.separator + user.getUuid();
            File userDir = new File(path);
            if (!userDir.exists()) {
                userDir.mkdirs();
            }

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            login, password
                    );

            Authentication auth;
            try {
                auth= authenticationManager.authenticate(authToken);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (AuthenticationException ex) {
                System.out.println(ex.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String jwt = jwtService.generateToken(user.getLogin(), user.getUuid());
            return ResponseEntity.ok(new LogResponse(user.getUuid(), jwt));
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.ofNullable(null);
    }

    @Operation(summary = "Sign in")
    @PostMapping(value = "/login")
    public ResponseEntity<LogResponse> login(
            @Parameter(description = "Login", required = true) @RequestParam("login") String login,
            @Parameter(description = "Password", required = true) @RequestParam("password") String password
    ) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(login, password);
            Authentication auth = authenticationManager.authenticate(authToken);
            if (!auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            SecurityContextHolder.getContext().setAuthentication(auth);
            User user = userService.get(login, password);
            if (user != null) {
                String jwt = jwtService.generateToken(user.getLogin(), user.getUuid());
                return ResponseEntity.ok(new LogResponse(user.getUuid(), jwt));
            }
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.ofNullable(null);
    }
}

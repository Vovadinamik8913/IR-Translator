package ru.ir.translator.controller.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Getter
@RequiredArgsConstructor
public class LogResponse {
    private final UUID uuid;
    private final String token;
}

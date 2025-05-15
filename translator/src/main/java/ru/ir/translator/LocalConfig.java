package ru.ir.translator;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class LocalConfig {
    @Value("${app.work-path}")
    private String workPath;
    @Value("${app.front-path}")
    private String frontPath;
}

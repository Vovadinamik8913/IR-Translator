package ru.ir.translator;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;

import java.io.File;
import java.io.IOException;

@Getter
public class LocalConfig {
    private String workPath;
    private static LocalConfig instance;

    private LocalConfig() {}

    public static LocalConfig getInstance() {
        if (instance == null) {
            instance = new LocalConfig();
        }
        return instance;
    }

    public static void deserializeFromJson() throws IOException {
        String filepath = "conf.json";
        ObjectMapper objectMapper = new ObjectMapper();
        instance = objectMapper.readValue(new File(filepath), LocalConfig.class);
    }

}

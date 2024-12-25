package ru.ir.translator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class IrTranslatorApplication {

	public static void main(String[] args) {

        try {
            LocalConfig.deserializeFromJson();
			SpringApplication.run(IrTranslatorApplication.class, args);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
	}

}

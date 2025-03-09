package ru.ir.translator.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    // Секретный ключ. В реальном приложении храните в защищённом месте!
    @Value("${token.signing.key}")
    private String signingKey;

    // Время жизни токена, например, 15 минут (15 * 60 * 1000 мс)
    @Value("${jwt.expiration:900000}")
    private long validityInMilliseconds;

    // Генерация токена
    public String generateToken(String username, UUID userUuid) {// Пример: 1 час
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        Key key = Keys.hmacShaKeyFor(signingKey.getBytes());
        return Jwts.builder()
                .setSubject(username)                 // Стандартный claim sub
                .claim("uuid", userUuid.toString())   // Свой кастомный claim
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key,  SignatureAlgorithm.HS256)
                .compact();
    }

    // Получить имя пользователя из токена
    public UUID getUuid(String token) {

        Jws<Claims> jwsClaims = Jwts.parser()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token);

        // Извлекаем стандартные и кастомные claims
        Claims body = jwsClaims.getBody();
        String uuidString = (String) body.get("uuid");
        return UUID.fromString(uuidString);
    }

    public String getUsername(String token) {
        return Jwts.parser()
                .setSigningKey(signingKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Проверить, валиден ли токен
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(signingKey.getBytes())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        return false;
    }
}


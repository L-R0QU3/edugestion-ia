package cl.edu.edugestion.auth.dto;

public record LoginResponse(
    String token,
    String email,
    String nombre,
    String rol) {}
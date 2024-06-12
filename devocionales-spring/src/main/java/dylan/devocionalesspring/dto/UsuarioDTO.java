package dylan.devocionalesspring.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class UsuarioDTO {

    // Getters y Setters
    private Long idUsuario;
    private String nombre;
    private String email;
    private String celular;
    private String contrasenia;
    private ImagenDTO fotoPerfil; // DTO para imagen


}

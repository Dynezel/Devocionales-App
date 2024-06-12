package dylan.devocionalesspring.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class ComentarioDTO {
    private Long id;
    private String texto;
    private LocalDate fechaCreacion;
    private Long idDevocional;
    private UsuarioDTO usuario;

}

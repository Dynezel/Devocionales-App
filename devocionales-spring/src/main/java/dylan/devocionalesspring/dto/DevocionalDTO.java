package dylan.devocionalesspring.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class DevocionalDTO {

    private int id;
    private String nombre;
    private String descripcion;
    private LocalDate fechaCreacion;
    private UsuarioDTO autor; // Relación con UsuarioDTO
    // Agrega aquí cualquier otra propiedad necesaria
    // Getters y Setters

}

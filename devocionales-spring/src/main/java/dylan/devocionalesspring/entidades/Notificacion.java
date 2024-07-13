package dylan.devocionalesspring.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tipo; // Ej: mensaje, like, seguimiento
    private String mensaje;
    private Long usuarioReceptorId;
    private Long usuarioEmisorId;
    private boolean visto;
    private LocalDateTime timestamp;

    // Getters y Setters
}
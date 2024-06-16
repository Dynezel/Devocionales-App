package dylan.devocionalesspring.entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dylan.devocionalesspring.enumeraciones.Rol;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Devocional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private String descripcion;
    private LocalDate fechaCreacion;

    @OneToMany(mappedBy = "devocional", cascade = CascadeType.ALL)
    private List<Comentario> comentarios;
}


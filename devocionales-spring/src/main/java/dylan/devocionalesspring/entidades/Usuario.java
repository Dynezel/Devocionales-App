package dylan.devocionalesspring.entidades;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import dylan.devocionalesspring.enumeraciones.Rol;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "idUsuario")
public class Usuario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private String nombre;
    private String email;
    private String celular;
    private String contrasenia;
    private String contrasenia2;

    // private Boolean alta;

    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "imagen_id")
    private Imagen fotoPerfil;

    @Enumerated
    private Rol rol;

    @OneToMany(mappedBy = "autor")
    private List<Devocional> devocionales;

    @OneToMany(mappedBy = "usuario")
    private List<Comentario> comentarios;

}
// private String resetPwToken;